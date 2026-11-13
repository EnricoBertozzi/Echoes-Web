import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { PageTitle } from "~/components/atoms/PageTitle";
import { Main } from "~/components/atoms/page/Main";
import { Button } from "~/components/atoms/Button";
import { ControlledTextField } from "~/components/molecules/controlled/ControlledTextField";

import { useInstitution } from "~/hooks/useInstitution";
import { useUpdateInstitution } from "~/hooks/useUpdateInstitution";

import type { Institution } from "~/types/Institution";
import type { InstitutionRegisterRequest } from "~/types/Institution";

import { maskCnpjInput } from "~/utils/cnpj";

export default function EditInstitution() {
  const { institutionId } = useParams();

  const { institution, loading, error } = useInstitution(institutionId);

  if (loading) {
    return (
      <Main>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-slate-500">Carregando...</p>
        </div>
      </Main>
    );
  }

  if (error || !institution) {
    return (
      <Main>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-red-500">
            {error ?? "Instituição não encontrada"}
          </p>
        </div>
      </Main>
    );
  }

  return <EditInstitutionForm key={institution.id} institution={institution} />;
}

function EditInstitutionForm({ institution }: { institution: Institution }) {
  const navigate = useNavigate();

  const form = useUpdateInstitution(institution, (updated) =>
    navigate(`/institutions/${updated.id}`),
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<InstitutionRegisterRequest>({
    mode: "onChange",
    defaultValues: {
      name: institution.name,
      acronym: institution.acronym,
      cnpj: maskCnpjInput(institution.cnpj),
      email: institution.email,
      phone: institution.phone ?? "",
      address: institution.address,
    },
  });

  return (
    <Main>
      <PageTitle
        title="Editar instituição"
        description={`Altere os dados de ${institution.name}.`}
        backPath={`/institutions/${institution.id}`}
      />

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(form.submitInstitution)}
      >
        <ControlledTextField
          id="cnpj"
          name="cnpj"
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          control={control}
          readOnly
          rules={{
            required: "O CNPJ é obrigatório.",
          }}
        />

        <ControlledTextField
          id="name"
          name="name"
          label="Razão social"
          placeholder="Digite a razão social"
          control={control}
          rules={{
            required: "A razão social é obrigatória.",
          }}
        />

        <ControlledTextField
          id="acronym"
          name="acronym"
          label="Sigla"
          placeholder="Digite a sigla"
          control={control}
          rules={{
            required: "A sigla é obrigatória.",
          }}
        />

        <ControlledTextField
          id="email"
          name="email"
          label="E-mail"
          placeholder="Digite o e-mail"
          control={control}
          rules={{
            required: "O e-mail é obrigatório.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Informe um e-mail válido.",
            },
          }}
        />

        <ControlledTextField
          id="phone"
          name="phone"
          label="Telefone"
          placeholder="Digite o telefone"
          control={control}
          rules={{}}
        />

        <ControlledTextField
          id="address"
          name="address"
          label="Endereço"
          placeholder="Digite o endereço"
          control={control}
          rules={{
            required: "O endereço é obrigatório.",
          }}
        />

        {form.generalError && (
          <p className="text-sm text-red-500">{form.generalError}</p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button
            label="Cancelar"
            variant="muted"
            type="button"
            className="max-w-40"
            onClick={() => navigate(`/institutions/${institution.id}`)}
          />

          <Button
            label={isSubmitting ? "Salvando..." : "Salvar alterações"}
            variant="primary"
            type="submit"
            className="max-w-48"
            disabled={!isDirty || isSubmitting || form.submitting}
          />
        </div>
      </form>
    </Main>
  );
}
