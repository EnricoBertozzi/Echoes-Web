import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ControlledEmailField } from "~/components/molecules/controlled/ControlledEmailField";
import { useForgotPassword } from "~/hooks/auth/password/useForgotPassword";

interface FormData {
  email: string;
}

export default function PasswordForgotPage() {
  const { handleForgotPassword, loading, error } = useForgotPassword();

  const { handleSubmit, control } = useForm<FormData>();

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form
        className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104"
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <PageTitle
          title="Echoes"
          description="Informe seu e-mail para recuperação de senha"
          backPath="/"
        />

        <ControlledEmailField
          control={control}
          id="email"
          name="email"
          label="E-mail"
          placeholder="Digite seu e-mail"
          rules={{
            required: "E-mail obrigatório",
          }}
        />

        <div className="w-full mt-2">
          <Button disabled={loading} label={loading ? "Enviando" : "Enviar"} />
        </div>
      </form>
    </main>
  );
}
