import { Link, useSearchParams } from "react-router";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { useRegister } from "~/hooks/useRegister";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro - Echoes" },
    { name: "description", content: "Finalize seu cadastro no Echoes" },
  ];
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const urlEmail = searchParams.get("email") ?? "";

  const register = useRegister(code, urlEmail);

  const hasValidParams = code.trim() !== "" && urlEmail.trim() !== "";

  if (!hasValidParams) {
    return (
      <main className='bg-zinc-200 w-full h-full flex justify-center items-center'>
        <div className='bg-white px-8 py-5 rounded shadow flex flex-col gap-6 w-full max-w-md items-center text-center'>
          <FiAlertCircle size={48} className='text-main' />
          <h1 className='text-lg text-black font-semibold'>Link inválido</h1>
          <p className='text-sm text-gray-600'>
            O link de cadastro está incompleto ou expirado. Solicite um novo
            convite por e-mail.
          </p>
          <Link to='/' className='text-main underline'>
            Ir para o login
          </Link>
        </div>
      </main>
    );
  }

  if (register.registeredUser) {
    return (
      <main className='bg-zinc-200 w-full h-full flex justify-center items-center'>
        <div className='bg-white px-8 py-5 rounded shadow flex flex-col gap-6 w-full max-w-md items-center text-center'>
          <FiCheckCircle size={48} className='text-green-600' />
          <h1 className='text-lg text-black font-semibold'>
            Conta ativada com sucesso!
          </h1>
          <p className='text-sm text-gray-600'>
            Bem-vindo(a), {register.registeredUser.name}! Sua senha foi criada.
            Você já pode entrar no Echoes.
          </p>
          <Link to='/' className='text-main underline'>
            Ir para o login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='bg-zinc-200 w-full h-full flex justify-center items-center'>
      <form
        className='bg-white px-8 py-5 rounded shadow flex flex-col gap-10 w-full max-w-md'
        onSubmit={register.handleSubmit}
      >
        <div className='flex flex-col gap-1'>
          <h1 className='text-lg text-black'>Criar senha</h1>
          <p className='text-sm text-gray-600'>
            Finalizando o cadastro de{" "}
            <span className='text-black font-medium'>{urlEmail}</span>
          </p>
        </div>

        <div className='flex flex-col gap-2'>
          <p>Senha</p>
          <TextInput
            type='password'
            placeholder='Digite a senha'
            aria-label='Senha'
            value={register.password}
            onChange={(event) => register.setPassword(event.target.value)}
          />
          {register.fieldErrors.password && (
            <span className='text-sm text-red-500'>
              {register.fieldErrors.password}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <p>Confirmar senha</p>
          <TextInput
            type='password'
            placeholder='Digite a senha novamente'
            aria-label='Confirmar senha'
            value={register.confirmPassword}
            onChange={(event) =>
              register.setConfirmPassword(event.target.value)
            }
          />
          {register.fieldErrors.confirmPassword && (
            <span className='text-sm text-red-500'>
              {register.fieldErrors.confirmPassword}
            </span>
          )}
        </div>

        {register.apiError && (
          <p className='text-sm text-red-500'>{register.apiError}</p>
        )}

        <div
          className={
            register.submitting ? 'pointer-events-none opacity-60' : undefined
          }
        >
          <Button
            label={register.submitting ? 'Cadastrando...' : 'Cadastrar'}
          />
        </div>
      </form>
    </main>
  );
}
