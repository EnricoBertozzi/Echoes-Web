import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";
import { useValidatePasswordCode } from "~/hooks/auth/password/useValidatePasswordCode";

export default function PasswordValidCode() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  
  if (email == null) {
    navigate("/")
  }

  const {code, setCode, handleValidatePasswordCode} = useValidatePasswordCode(email!);
  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104" onSubmit={handleValidatePasswordCode}>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => navigate("/")} className="cursor-pointer text-left text-sm text-slate-500 hover:underline">
            Voltar
          </button>
          <PageTitle title="Echoes" description="Caso o e-mail esteja correto, um código será enviado. Insirá-o aqui"/>
        </div>
        
        <TextInputWithLabel label="Código" placeholder="Digite o código" value={code} type="text" name="code" onChange={setCode}/>
        
        <div className="w-full pt-2">
          <Button label="Enviar" />
        </div>
      </form>
    </main>
  );

}
