import axios from "axios";
import { toast } from "sonner";
import { notifyPendingTerms } from "~/utils/termsEvents";
import { setSessionHint } from "~/utils/session";
import { ApiRequestError, parseErrorBody } from "./errors";

const baseURL = import.meta.env.VITE_API_URL;
const legacyPrefix = "/api/legacy";
const usesDirectLocalApi =
  import.meta.env.DEV &&
  /^https?:\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\/?$/.test(baseURL ?? "");

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

/**
 * Identifica o cliente web. O servidor exige este header nas mutações feitas
 * só com o cookie (proteção contra CSRF).
 */
api.interceptors.request.use(
  (config) => {
    // O proxy de produção remove esse prefixo antes de encaminhar ao Spring.
    if (usesDirectLocalApi && config.url?.startsWith(`${legacyPrefix}/`)) {
      config.url = config.url.slice(legacyPrefix.length);
    }

    config.headers["X-Echoes-Client"] = "web";

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

      // Sessão revogada ou expirada: volta para o login (fora da tela de login,
      // onde 401 é esperado).
      if (
        status === 401 &&
        typeof window !== "undefined" &&
        window.location.pathname !== "/"
      ) {
        setSessionHint(false);
        window.location.assign("/");
      }

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
