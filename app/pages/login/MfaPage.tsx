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

  if (email == null) {
    navigate("/");
  }

  const { handleMfaSubmit } = useValidMfa();
  const { handleSubmit, control, register } = useForm<FormData>({
    defaultValues: {
      email: email!,
      code: "",
    },
  });

  return (
    <main className="bg-zinc-200 w-full h-full flex justify-center items-center">
      <form
        className="bg-white p-8 rounded shadow flex flex-col gap-8 w-104"
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
                message: "Código incompleto"
              }
            }}
            onSubmit={() => handleSubmit(handleMfaSubmit)}
          />
        </div>

        <div className="w-full pt-4">
          <Button label="Enviar" />
        </div>
      </form>
    </main>
  );
}
