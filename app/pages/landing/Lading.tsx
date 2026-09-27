import {
  useForm
} from "react-hook-form";
import { Link } from "react-router";
import { PageTitle } from "~/components/atoms/PageTitle";
import { PasswordField } from "~/components/atoms/PasswordField";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";
import { useLogin } from "~/hooks/auth/useLogin";
import type { Route } from "./+types/Lading";
import { Button } from "~/components/atoms/Button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Echoes" },
    { name: "description", content: "Bem-vindo ao Echoes" },
  ];
}

interface FormData {
  email: string,
  password: string
}

export default function Landing() {
  const { handleLogin } = useLogin();

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form
        className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104"
        onSubmit={handleSubmit(handleLogin)}>
        <PageTitle title="Echoes" description="Seja bem-vindo" />
        <div className="flex flex-col gap-6">
          <TextInputWithLabel 
            id="email"
            name="email" 
            control={control} 
            label="E-mail" 
            placeholder="Digite seu e-mail" 
            type="text"
            rules={{
              required: "E-mail obrigatório",
              pattern: {
                value: /^(?!.*[A-Z])[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Informe um e-mail válido",
              },
            }} 
          />

          <div className="flex flex-col gap-1">
            <PasswordField label="Senha" placeholder="Digite sua senha" id="password" control={control} name="password" key="password"/>

            <p className="ms-1 text-sm text-slate-500">
              <Link to={"/password/forgot"}>
                Esqueceu a senha? 
              </Link>
            </p>
          </div>
        </div>
        <div className="w-full pt-4">
          <Button label="Enviar" type="submit"/>
        </div>
      </form>
    </main>
  );
}
