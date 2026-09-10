import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import type { Route } from "./+types/landing";
import { useLogin } from "~/hooks/useLogin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Echoes" },
    { name: "description", content: "Bem-vindo ao Echoes" },
  ];
}

export default function Landing() {
  const login = useLogin();

  return (
    <main className='bg-zinc-200 w-full h-full flex justify-center items-center'>
      <form className='bg-white px-8 py-5 rounded shadow flex flex-col gap-10'>
        <h1 className='text-lg text-black'>Echoes - Simulador Ausculta</h1>
        <TextInput
          placeholder='E-mail'
          type='email'
          name='email'
        />
        <TextInput
          placeholder='Senha'
          type='password'
          name='password'
        />
        <Button
          label='Entrar'
          onClick={login.login}
        />
      </form>
    </main>
  )
}
