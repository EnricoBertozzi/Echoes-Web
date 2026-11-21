import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { PageTitle } from "~/components/atoms/PageTitle";
import { PasswordField } from "~/components/molecules/input/PasswordField";
import { TextField } from "~/components/molecules/input/TextField";
import { useLogin } from "~/hooks/auth/useLogin";
import type { Route } from "./+types/LoginPage";
import { Button } from "~/components/atoms/Button";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";
import { ControlledPasswordField } from "~/components/molecules/controlled/ControlledPasswordField";
import { ControlledEmailField } from "~/components/molecules/controlled/ControlledEmailField";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Echoes" },
    { name: "description", content: "Bem-vindo ao Echoes" },
  ];
}

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { handleLogin, loading, error } = useLogin();

  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-zinc-200 px-4 py-6">
      <form
        className="my-auto flex w-full max-w-104 shrink-0 flex-col gap-6 rounded bg-white p-4 shadow sm:gap-8 sm:p-8"
        onSubmit={handleSubmit(handleLogin)}
      >
        <PageTitle title="Echoes" description="Seja bem-vindo" />

        <div className="flex flex-col gap-6">
          <ControlledEmailField
            id="email"
            name="email"
            label="E-mail"
            placeholder="Digite seu e-mail"
            control={control}
            rules={{
              required: "E-mail obrigatório",
            }}
          />

          <div className="flex flex-col gap-1">
            <ControlledPasswordField
              id="password"
              name="password"
              label="Senha"
              placeholder="Digite sua senha"
              control={control}
              rules={{
                required: "Senha é obrigatória",
              }}
            />

            <p>
              <Link
                className="inline-flex min-h-11 items-center text-sm text-slate-500 decoration-slate-500 underline-offset-1 hover:underline lg:min-h-0"
                to={"/password/forgot"}
              >
                Esqueceu a senha?
              </Link>
              
            </p>
          </div>
        </div>
        <div className="w-full pt-4">
          <Button 
            label={loading ? "Enviando" : "Enviar"} 
            disabled={loading}
            type="submit" 
          />
        </div>
      </form>
    </main>
  );
}
