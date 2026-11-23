import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUser } from "react-icons/fi";

import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { SectionCard } from "~/components/molecules/SectionCard";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";
import { useAuth } from "~/context/AuthContext";
import { useUpdateProfile } from "~/hooks/profile/useUpdateProfile";

interface ProfileFormValues {
  name: string;
}

export function ProfileDetailsForm() {
  const { user } = useAuth();
  const { loading, handleUpdateProfile } = useUpdateProfile();
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isDirty, isSubmitting },
  } = useForm<ProfileFormValues>({
    mode: "onBlur",
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  // Mantém o formulário sincronizado quando o usuário é atualizado no contexto
  // (por exemplo, depois de salvar ou de restaurar a sessão).
  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  if (!user) return null;

  async function submit(values: ProfileFormValues) {
    setFormError(null);
    setSaved(false);

    const result = await handleUpdateProfile(values);

    if (result.success) {
      setSaved(true);
      return;
    }

    let hasFieldError = false;

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        if (field === "name") {
          setError(field, { message });
          hasFieldError = true;
        }
      }
    }

    setFormError(hasFieldError ? null : result.message);
  }

  const submitting = loading || isSubmitting;

  return (
    <SectionCard
      title="Dados pessoais"
      description="Mantenha suas informações de identificação atualizadas."
      icon={FiUser}
    >
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(submit)}
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ControlledTextField
            id="profile-name"
            name="name"
            label="Nome"
            placeholder="Digite seu nome"
            control={control}
            rules={{
              required: "O nome é obrigatório.",
            }}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="profile-email" className="text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              id="profile-email"
              name="email"
              value={user.email}
              disabled
              readOnly
              className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-slate-600"
            />
            <p className="text-xs text-slate-500">
              O e-mail não pode ser alterado.
            </p>
          </div>
        </div>

        {formError && <Alert message={formError} type="error" />}

        {saved && !isDirty && !formError && (
          <Alert message="Dados atualizados com sucesso." type="success" />
        )}

        <div className="flex justify-end">
          <div className="w-full sm:w-56">
            <Button
              type="submit"
              label={submitting ? "Salvando..." : "Salvar alterações"}
              disabled={!isDirty || submitting}
            />
          </div>
        </div>
      </form>
    </SectionCard>
  );
}
