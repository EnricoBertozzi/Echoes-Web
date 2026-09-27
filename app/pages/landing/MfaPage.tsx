import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInput } from "~/components/atoms/TextInput";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";
import { useValidMfa } from "~/hooks/auth/useValidMfa";

interface FormData {
  email: string
  code: string
}

export default function MfaPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  if (email == null) {
    navigate("/")
  }

  const { handleMfaSubmit } = useValidMfa()
  const { handleSubmit, control, register } = useForm<FormData>({
    defaultValues: {
      email: email!,
      code: ""
    }
  });
  
  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104" onSubmit={handleSubmit(handleMfaSubmit)}>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => navigate("/")} className="cursor-pointer text-left text-sm text-slate-500 hover:underline w-fit">
            Voltar
          </button>
          <PageTitle title="Echoes" description="Digite o código de verificação enviado para o seu e-mail" />
        </div>

        <div className="flex flex-col gap-6">
          <input type="hidden" {...register("email")}/>

          <TextInputWithLabel 
            id="code"
            name="code"
            control={control}  
            label="Código" 
            placeholder="Digite o código"  
            type="text"
            rules={{
              required: "Campo obrigatório",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Código inválido"
              }
            }} 
          />
        </div>
        
        <div className="w-full pt-4">
          <Button label="Enviar" />
        </div>
      </form>
    </main>
  );
}