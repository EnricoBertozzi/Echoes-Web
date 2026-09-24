import axios from "axios";
import { toast } from "sonner";
import { ApiRequestError, parseErrorBody } from "./errors";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Interceptador para token JWT
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Interceptador para exibição de erros com toast lateral
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 0;

      const { message, fieldErrors } = parseErrorBody(error.response?.data);

      const apiError = new ApiRequestError(status, message, fieldErrors);

      toast.error(apiError.message, { position: "bottom-right" });

      return Promise.reject(apiError);
    }

    if (error instanceof Error) {
      toast.error(error.message);

      return Promise.reject(new ApiRequestError(0, error.message));
    }

    const apiError = new ApiRequestError(0);

    toast.error(apiError.message, { position: "bottom-right" });

    return Promise.reject(apiError);
  },
);

export { ApiRequestError };
