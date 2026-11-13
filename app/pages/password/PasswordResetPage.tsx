import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, Navigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { Modal } from "~/components/atoms/modal/Modal";
import { ModalTitle } from "~/components/atoms/modal/ModalTitle";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ControlledPasswordField } from "~/components/molecules/controlled/ControlledPasswordField";
import { PasswordField } from "~/components/molecules/input/PasswordField";
import { useResetPassword } from "~/hooks/auth/password/useResetPassword";

interface FormData {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordResetPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const token = sessionStorage.getItem("reset_token");

  const navigate = useNavigate();

  const { handleResetPassword, isSuccess, isError } = useResetPassword();

  const { handleSubmit, control, register, watch } = useForm<FormData>({
    defaultValues: {
      email: email!,
      token: token!,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  if (!isSuccess && !isError) {
    if (email == null || token == null) {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form
        className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104"
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
            rules={{
              required: "Senha obrigatória",
              minLength: {
                value: 8,
                message: "A senha deve ter no mínimo 8 caracteres",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                message:
                  "A senha deve conter maiúscula, minúscula, número e caractere especial",
              },
            }}
          />

          <ControlledPasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirme sua senha"
            placeholder="Digite sua nova senha"
            control={control}
            rules={{
              required: "Confirmação de senha obrigatória",
              validate: (value) =>
                value === newPassword || "As senhas não são iguais",
            }}
          />
        </div>

        <div className="w-full pt-4">
          <Button type="submit" label="Alterar" />
        </div>
      </form>

      <Modal isOpen={isSuccess} onClose={() => navigate("/")}>
        <ModalTitle
          title="Senha alterada com sucesso!"
          description="Clique no botão para retornar ao login"
        />
        <div className="w-full flex flex-row justify-end">
          <div className="w-32">
            <Button label="Voltar" onClick={() => navigate("/")} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={isError} onClose={() => navigate("/")}>
        <ModalTitle
          title="Não foi possível alterar a senha"
          description="Tente novamente mais tarde..."
        />
        <div className="w-full flex flex-row justify-end">
          <div className="w-32">
            <Button label="Voltar" onClick={() => navigate("/")} />
          </div>
        </div>
      </Modal>
    </main>
  );
}
