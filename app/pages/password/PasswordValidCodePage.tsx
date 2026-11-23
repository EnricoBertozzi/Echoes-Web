import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ControlledCodeField } from "~/components/molecules/controlled/ControlledCodeField";
import { useValidatePasswordCode } from "~/hooks/auth/password/useValidatePasswordCode";
import { EMAIL_MAX_LENGTH, VERIFICATION_CODE_LENGTH } from "~/utils/authInputValidation";

interface FormData {
  email: string;
  code: string;
}

export default function PasswordValidCodePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const { handleValidatePasswordCode } = useValidatePasswordCode();

  const { handleSubmit, control, register } = useForm<FormData>({
    defaultValues: {
      email: email ?? "",
      code: "",
    },
  });

  if (!email || email.length > EMAIL_MAX_LENGTH) return <Navigate to="/" replace />;

  return (
    <main className="flex min-h-dvh w-full flex-col items-center bg-zinc-200 px-4 py-6">
      <form
        className="my-auto flex w-full max-w-104 shrink-0 flex-col gap-6 rounded bg-white p-4 shadow sm:gap-8 sm:p-8"
        onSubmit={handleSubmit(handleValidatePasswordCode)}
      >
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="min-h-11 cursor-pointer text-left text-sm text-slate-500 hover:underline lg:min-h-0"
          >
            Voltar
          </button>
          <PageTitle
            title="Echoes"
            description="Caso o e-mail esteja correto, um código será enviado. Insirá-o aqui"
          />
        </div>

        <input type="hidden" {...register("email")} />

        <ControlledCodeField
          control={control}
          id="code"
          name="code"
          label={"Código"}
          length={VERIFICATION_CODE_LENGTH}
        />

        <div className="w-full pt-2">
          <Button type="submit" label="Enviar" />
        </div>
      </form>
    </main>
  );
}
