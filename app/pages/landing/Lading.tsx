import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { useLogin } from "~/hooks/auth/useLogin";
import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/Lading";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInputWithLabel } from "~/components/atoms/TextInputWithLabel";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Echoes" },
    { name: "description", content: "Bem-vindo ao Echoes" },
  ];
}

export default function Landing() {
  const { email, setEmail, password, setPassword, handleSubmit } = useLogin();

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104" onSubmit={handleSubmit}>
        <PageTitle title="Echoes" description="Seja bem-vindo" />
        <div className="flex flex-col gap-6">
          <TextInputWithLabel label="E-mail" placeholder="Digite seu e-mail" value={email} type="text" name="email" onChange={setEmail} />
          <TextInputWithLabel label="Senha" placeholder="Digite sua senha" value={password} type="password" name="password" onChange={setPassword} />

          <Link to={"/password/forgot"}>
            <span className="text-black">Esqueceu a senha?</span>
          </Link>
        </div>
        <div className="w-full pt-4">
          <Button label="Entrar" />
        </div>
      </form>
    </main>
  );
}
