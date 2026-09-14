import { useNavigate, useParams } from "react-router";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInput } from "~/components/atoms/TextInput";
import { useInstitution } from "~/hooks/useInstitution";
import { useUpdateInstitution } from "~/hooks/useUpdateInstitution";
import type { Institution } from "~/types/Institution";

export default function EditInstitution() {
  const { institutionId } = useParams();
  const navigate = useNavigate();

  const { institution, loading, error } = useInstitution(institutionId);

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-xl text-slate-500">Carregando...</p>
      </main>
    );
  }

  if (error || !institution) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <p className="text-xl text-red-500">
          {error ?? "Instituição não encontrada"}
        </p>
      </main>
    );
  }

  return <EditInstitutionForm institution={institution} />;
}

function EditInstitutionForm({ institution }: { institution: Institution }) {
  const navigate = useNavigate();

  const form = useUpdateInstitution(institution, (updated) =>
    navigate(`/dashboard/school/${updated.id}`),
  );

  return (
    <main className="flex flex-1">
      <div className="flex w-full max-w-2xl flex-col gap-8 px-12 py-16">
        <PageTitle
          title="Editar instituição"
          description={`Altere os dados de ${institution.name}.`}
        />

        <form className="flex flex-col" onSubmit={form.handleSubmit}>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-medium">Nome</p>
            <TextInput
              placeholder="Digite o nome"
              aria-label="Nome"
              value={form.name}
              onChange={(event) => form.setName(event.target.value)}
              required
              className="text-gray-900"
            />
            {form.fieldErrors.name && (
              <span className="text-sm text-red-500">{form.fieldErrors.name}</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-gray-700 font-medium">Sigla</p>
            <TextInput
              placeholder="Digite a sigla"
              aria-label="Sigla"
              value={form.acronym}
              onChange={(event) => form.setAcronym(event.target.value)}
              required
              className="text-gray-900"
            />
            {form.fieldErrors.acronym && (
              <span className="text-sm text-red-500">{form.fieldErrors.acronym}</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-gray-700 font-medium">CNPJ</p>
            <TextInput
              placeholder="00.000.000/0000-00"
              aria-label="CNPJ"
              value={form.cnpj}
              onChange={(event) => form.setCnpj(event.target.value)}
              required
              className="text-gray-900"
            />
            {form.fieldErrors.cnpj && (
              <span className="text-sm text-red-500">{form.fieldErrors.cnpj}</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-gray-700 font-medium">E-mail</p>
            <TextInput
              type="email"
              placeholder="Digite o e-mail"
              aria-label="E-mail"
              value={form.email}
              onChange={(event) => form.setEmail(event.target.value)}
              required
              className="text-gray-900"
            />
            {form.fieldErrors.email && (
              <span className="text-sm text-red-500">{form.fieldErrors.email}</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-gray-700 font-medium">Telefone</p>
            <TextInput
              placeholder="Digite o telefone"
              aria-label="Telefone"
              value={form.phone}
              onChange={(event) => form.setPhone(event.target.value)}
              className="text-gray-900"
            />
            {form.fieldErrors.phone && (
              <span className="text-sm text-red-500">{form.fieldErrors.phone}</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <p className="text-gray-700 font-medium">Endereço</p>
            <TextInput
              placeholder="Digite o endereço"
              aria-label="Endereço"
              value={form.address}
              onChange={(event) => form.setAddress(event.target.value)}
              required
              className="text-gray-900"
            />
            {form.fieldErrors.address && (
              <span className="text-sm text-red-500">{form.fieldErrors.address}</span>
            )}
          </div>

          {form.generalError && (
            <p className="mt-4 text-sm text-red-500">{form.generalError}</p>
          )}

          <div className="mt-8 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/school/${institution.id}`)}
              className="cursor-pointer rounded px-4 py-2 font-medium text-red-500 hover:bg-red-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={form.submitting}
              className="cursor-pointer rounded bg-main px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {form.submitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
