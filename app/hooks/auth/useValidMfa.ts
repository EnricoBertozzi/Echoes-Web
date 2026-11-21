import { useRef } from "react";
import { useNavigate } from "react-router";
import { validMfa, type MfaRequest } from "~/api/auth";
import { fetchCurrentUser } from "~/api/users";
import { useAuth } from "~/context/AuthContext";
import { setSessionHint } from "~/utils/session";

export function useValidMfa() {
  const navigate = useNavigate();
  const auth = useAuth();
  const submitting = useRef(false);

  async function handleMfaSubmit(data: MfaRequest) {
    if (submitting.current) return;
    submitting.current = true;

    try {
      // o cookie de sessão é gravado pelo servidor nesta resposta (S10)
      await validMfa(data);
      setSessionHint(true);

      const currentUserResponse = await fetchCurrentUser();
      const currentUser = currentUserResponse.data;

      auth.login(currentUser);

      // professor e aluno não têm painel: vão direto para as próprias turmas
      const isClassroomMember =
        currentUser.role === "TEACHER" || currentUser.role === "STUDENT";

      navigate(isClassroomMember ? "/classrooms" : "/dashboard", {
        replace: true,
      });
    } catch (error) {
      setSessionHint(false);
      throw error;
    } finally {
      submitting.current = false;
    }
  }

  return { handleMfaSubmit };
}
