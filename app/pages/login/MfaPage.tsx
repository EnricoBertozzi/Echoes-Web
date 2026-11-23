import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ControlledCodeField } from "~/components/molecules/controlled/ControlledCodeField";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";
import { CodeField } from "~/components/molecules/input/CodeField";
import { useValidMfa } from "~/hooks/auth/useValidMfa";

interface FormData {
  email: string;
  code: string;
}

export default function MfaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      navigate("/", { replace: true });
    }
  }, [email, navigate]);

  const { handleMfaSubmit } = useValidMfa();
  const { handleSubmit, control, register, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      email: email!,
      code: "",
    },
  });

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-zinc-200 px-4 py-6">
      <form
        className="my-auto flex w-full max-w-104 shrink-0 flex-col gap-6 rounded bg-white p-4 shadow sm:gap-8 sm:p-8"
        onSubmit={handleSubmit(handleMfaSubmit)}
      >
        <PageTitle
          title="Echoes"
          description="Digite o código de verificação enviado para o seu e-mail"
          backPath="/"
        />

        <div className="flex flex-col gap-6">
          <input type="hidden" {...register("email")} />

          <ControlledCodeField
            id="code"
            name="code"
            label={"Código"}
            length={6}
            control={control}
            rules={{
              required: "Código obrigatório",
              minLength: {
                value: 6,
                message: "Código incompleto",
              },
            }}
          />
        </div>

        <div className="w-full pt-4">
          <Button
            type="submit"
            label={isSubmitting ? "Verificando..." : "Enviar"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </main>
  );
}
