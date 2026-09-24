import { useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";
import { useForgotPassword } from "~/hooks/auth/password/useForgotPassword";

export default function PasswordForgot() {
  const { email, setEmail, handleForgotPassword } = useForgotPassword()
  const navigate = useNavigate() 

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104" onSubmit={handleForgotPassword}>
        
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => navigate("/")} className="cursor-pointer text-left text-sm text-slate-500 hover:underline w-fit">
            Voltar
          </button>
          <PageTitle title="Echoes" description="Informe seu e-mail para redefinição de senha" />
        </div>

        <TextInputWithLabel label="E-mail" placeholder="Digite seu e-mail" value={email} type="text" name="email" onChange={setEmail}/>

        <div className="w-full mt-2">
          <Button label="Enviar"/>
        </div>
      </form>
    </main>
  );
}
