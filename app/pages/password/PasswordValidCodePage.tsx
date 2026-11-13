import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { ControlledCodeField } from "~/components/molecules/controlled/ControlledCodeField";
import { useValidatePasswordCode } from "~/hooks/auth/password/useValidatePasswordCode";

interface FormData {
  email: string;
  code: string;
}

export default function PasswordValidCodePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();

  if (email == null) {
    navigate("/");
  }

  const { handleValidatePasswordCode } = useValidatePasswordCode();

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
        onSubmit={handleSubmit(handleValidatePasswordCode)}
      >
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer text-left text-sm text-slate-500 hover:underline"
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
          length={6}
          rules={{
            required: "Código Obrigatório",
            minLength: {
              value: 6,
              message: "Código Inválido"
            } 
          }}
          onSubmit={handleSubmit(handleValidatePasswordCode)}
        />

        <div className="w-full pt-2">
          <Button type="submit" label="Enviar" />
        </div>
      </form>
    </main>
  );
}
