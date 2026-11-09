import { useNavigate } from "react-router";
import { validMfa, type MfaRequest } from "~/api/auth";
import { fetchCurrentUser } from "~/api/users";
import { useAuth } from "~/context/AuthContext";

export function useValidMfa() {
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleMfaSubmit(data: MfaRequest) {
    try {
      const mfaResponse = await validMfa(data);
      const token = mfaResponse.data.token;

      localStorage.setItem("jwt_token", token);
      const currentUserResponse = await fetchCurrentUser();

      auth.login(currentUserResponse.data);

      navigate("/dashboard/scene", { replace: true });
    } catch (error) {
      localStorage.removeItem("jwt_token");
      throw error;
    }
  }

  return { handleMfaSubmit };
}