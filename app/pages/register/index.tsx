import { Link, useSearchParams } from "react-router";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { useRegister } from "~/hooks/useRegister";
import type { Route } from "./+types/index";
import { PasswordField } from "~/components/atoms/PasswordField";
import { PageTitle } from "~/components/atoms/PageTitle";
import { useForm } from "react-hook-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cadastro - Echoes" },
    { name: "description", content: "Finalize seu cadastro no Echoes" },
  ];
}

interface FormData {
  email: string
  code: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const urlEmail = searchParams.get("email") ?? "";

  const {handleRegisterSubmit, registeredUser, apiError, submitting} = useRegister(code, urlEmail);

  const hasValidParams = code.trim() !== "" && urlEmail.trim() !== "";

  const {handleSubmit, control, watch, register } = useForm<FormData>({
    defaultValues: {
      email: urlEmail,
      code: code,
      password: "",
      confirmPassword: ""
    }
  });

  const password = watch("password")

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

  if (registeredUser) {
    return (
      <main className='bg-zinc-200 w-full h-full flex justify-center items-center'>
        <div className='bg-white px-8 py-5 rounded shadow flex flex-col gap-6 w-full max-w-md items-center text-center'>
          <FiCheckCircle size={48} className='text-green-600' />
          <h1 className='text-lg text-black font-semibold'>
            Conta ativada com sucesso!
          </h1>
          <p className='text-sm text-gray-600'>
            Bem-vindo(a), {registeredUser.name}! Sua senha foi criada.
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
        onSubmit={handleSubmit(handleRegisterSubmit)}
      >
        <PageTitle title="Finalização de Cadastro" description={`Finalizando cadastro de ${urlEmail}`} />

        <input type="hidden" {...register("email")}/>
        <input type="hidden" {...register("code")}/>  
    
        <div className='flex flex-col gap-2'>
          <PasswordField 
            id="password" 
            name="password" 
            label="Senha" 
            placeholder="Digite sua senha" 
            control={control} 
            rules={{
              minLength: {
                value: 8,
                message: "A senha deve ter no mínimo 8 caracteres"
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                message:
                  "A senha deve conter maiúscula, minúscula, número e caractere especial"
              }
            }}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <PasswordField 
            id="confirmPassword" 
            name="confirmPassword" 
            label="Confirmação de Senha"
            placeholder="Confirme sua senha" 
            control={control}
            rules={{
              validate: (value) => value === password || "As senhas não são iguais"
            }}
          />
        </div>

        {apiError && (
          <p className='text-sm text-red-500'>{apiError}</p>
        )}

        <div
          className={
            submitting ? 'pointer-events-none opacity-60' : undefined
          }
        >
          <Button
            type="submit"
            label={submitting ? 'Cadastrando...' : 'Cadastrar'}
          />
        </div>
      </form>
    </main>
  );
}
