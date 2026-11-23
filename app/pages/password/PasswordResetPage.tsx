import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Navigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ControlledPasswordField } from "~/components/molecules/controlled/ControlledPasswordField";
import { useResetPassword } from "~/hooks/auth/password/useResetPassword";
import {
  EMAIL_MAX_LENGTH,
  newPasswordRules,
  validatePasswordConfirmation,
} from "~/utils/authInputValidation";
import type { Route } from "./+types/PasswordResetPage";

export function clientLoader() {
  return { token: sessionStorage.getItem("reset_token") };
}

clientLoader.hydrate = true as const;

export function HydrateFallback() {
  return null;
}

interface FormData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordResetPage({ loaderData: { token } }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const { handleResetPassword, isSuccess, isError } = useResetPassword();

  const { handleSubmit, control, register, watch } = useForm<FormData>({
    defaultValues: {
      email: email ?? "",
      token: token ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  if (!isSuccess && !isError) {
    if (!email || email.length > EMAIL_MAX_LENGTH || !token) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-zinc-200 px-4 py-6">
      <form
        className="my-auto flex w-full max-w-104 shrink-0 flex-col gap-6 rounded bg-white p-4 shadow sm:gap-8 sm:p-8"
        onSubmit={handleSubmit(handleResetPassword)}
      >
        <PageTitle
          title="Echoes"
          description="Digite e confirme sua senha"
          backPath="/"
        />

        <input type="hidden" {...register("email")} />
        <input type="hidden" {...register("token")} />

        <div className="flex flex-col gap-6">
          <ControlledPasswordField
            id="newPassword"
            name="newPassword"
            label="Nova senha"
            placeholder="Digite sua nova senha"
            control={control}
            rules={newPasswordRules}
          />

          <ControlledPasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirme sua senha"
            placeholder="Digite sua nova senha"
            control={control}
            rules={{
              required: "Confirmação de senha obrigatória",
              validate: (value) => validatePasswordConfirmation(value, newPassword),
            }}
          />
        </div>

        <div className="w-full pt-4">
          <Button type="submit" label="Alterar" />
        </div>
      </form>

      <Modal
        isOpen={isSuccess || isError}
        onClose={() => navigate("/")}
        className="w-150 max-w-[calc(100%_-_2rem)] max-h-[calc(100dvh_-_2rem)] overflow-y-auto overscroll-contain"
      >
        <ModalTitle
          title={
            isSuccess
              ? "Senha alterada com sucesso!"
              : "Não foi possível alterar a senha"
          }
          description={
            isSuccess
              ? "Clique no botão para retornar ao login"
              : "Tente novamente mais tarde..."
          }
        />
        <div className="flex justify-end">
          <div className="w-full sm:w-32">
            <Button label="Voltar" onClick={() => navigate("/")} />
          </div>
        </div>
      </Modal>
    </main>
  );
}
