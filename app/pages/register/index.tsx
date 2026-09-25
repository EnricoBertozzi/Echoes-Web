import { Link, useSearchParams } from "react-router";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { useRegister } from "~/hooks/useRegister";
import type { Route } from "./+types/index";
import { PasswordField } from "~/components/atoms/PasswordField";
import { PageTitle } from "~/components/atoms/PageTitle";

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
        className='bg-white p-8 rounded shadow flex flex-col gap-8 w-104'
        onSubmit={register.handleSubmit}
      >
        <PageTitle title="Finalização de Cadastro" description={`Finalizando cadastro de ${urlEmail}`} />
        
        
        <div className='flex flex-col gap-2'>
          <PasswordField label="Senha" placeholder="Digite sua senha" value={register.password} name="password" id="password" onChange={register.setPassword} />
          {register.fieldErrors.password && (
            <span className='text-sm text-red-500'>
              {register.fieldErrors.password}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <PasswordField label="Confirmação de Senha" placeholder="Confirme sua senha" value={register.confirmPassword} name="confirmPassword" id="confirmPassword" onChange={register.setConfirmPassword} />
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
