import axios from "axios";
import { toast } from "sonner";
import { notifyPendingTerms } from "~/utils/termsEvents";
import { ApiRequestError, parseErrorBody } from "./errors";

const baseURL = import.meta.env.VITE_API_URL;
const legacyPrefix = "/api/legacy";
const usesDirectLocalApi =
  import.meta.env.DEV &&
  /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/?$/.test(baseURL ?? "");

export const api = axios.create({
  baseURL,
});

/**
 * Interceptador para token JWT
 */
api.interceptors.request.use(
  (config) => {
    // O proxy de produção remove esse prefixo antes de encaminhar ao Spring.
    if (usesDirectLocalApi && config.url?.startsWith(`${legacyPrefix}/`)) {
      config.url = config.url.slice(legacyPrefix.length);
    }

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

      const { message, fieldErrors, pendingTerms } = parseErrorBody(
        error.response?.data,
      );

      const apiError = new ApiRequestError(
        status,
        message,
        fieldErrors,
        pendingTerms,
      );

      // O backend bloqueia a aplicação enquanto houver termos obrigatórios
      // pendentes. O gate escuta este evento para exibir a tela de aceite.
      if (status === 403 && pendingTerms?.length) {
        notifyPendingTerms(pendingTerms);
      }

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
