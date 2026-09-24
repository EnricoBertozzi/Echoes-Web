import { useNavigate, useSearchParams, Navigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";
import { useResetPassword } from "~/hooks/auth/password/useResetPassword";

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  if (email == null) {
    navigate("/");
  }

  const {newPassword, setNewPassword, confirmPassword, setConfirmPassword, handleResetPassword} = useResetPassword(email!);

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104" onSubmit={handleResetPassword}>
        
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => navigate("/")} className="cursor-pointer text-left text-sm text-slate-500 hover:underline w-fit">
            Voltar
          </button>
          <PageTitle title="Echoes" description="Digite e confirme sua senha" />
        </div>

        <div className="flex flex-col gap-6">
          <TextInputWithLabel label="Nova Senha" placeholder="Digite sua Nova Senha" value={newPassword} type="password" name="newPassword" onChange={setNewPassword} />
          <TextInputWithLabel label="Confirme sua Senha" placeholder="Confirme sua Senha" value={confirmPassword} type="password" name="confirmPassword" onChange={setConfirmPassword}/>
        </div>

        <div className="w-full pt-4">
          <Button label="Alterar" />
        </div>
      </form>
    </main>
  );
}