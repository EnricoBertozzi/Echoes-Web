import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";
import { useForgotPassword } from "~/hooks/auth/password/useForgotPassword";

interface FormData {
  email: string
}

export default function PasswordForgot() {
  const { handleForgotPassword } = useForgotPassword()
  const navigate = useNavigate() 

  const { handleSubmit, control } = useForm<FormData>()

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104" onSubmit={handleSubmit(handleForgotPassword)}>
        
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => navigate("/")} className="cursor-pointer text-left text-sm text-slate-500 hover:underline w-fit">
            Voltar
          </button>
          <PageTitle title="Echoes" description="Informe seu e-mail para redefinição de senha" />
        </div>
        
        <TextInputWithLabel 
          id="email"
          label="E-mail" 
          name="email" 
          placeholder="Digite seu e-mail" 
          control={control} 
          type="text"
          rules={{
            required: "E-mail obrigatório",
            pattern: {
                value: /^(?!.*[A-Z])[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Informe um e-mail válido",
              },
          }} 
        />

        <div className="w-full mt-2">
          <Button label="Enviar"/>
        </div>
      </form>
    </main>
  );
}
