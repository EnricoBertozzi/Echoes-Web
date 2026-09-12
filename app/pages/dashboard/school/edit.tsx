import { useNavigate, useParams } from "react-router";
import { InstitutionForm } from "~/components/organisms/InstitutionForm";
import { Navbar } from "~/components/molecules/Navbar";
import { useInstitution } from "~/hooks/useInstitution";
import { useUpdateInstitution } from "~/hooks/useUpdateInstitution";
import type { Route } from "./+types/edit";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Editar instituição — Echoes" }];
}

export default function EditInstitutionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { institution, loading: loadingInstitution, error: loadError } =
    useInstitution(id);
  const { update, loading: submitting, error: submitError } =
    useUpdateInstitution();

  async function handleSubmit(payload: Parameters<typeof update>[1]) {
    if (!id) return;
    const updated = await update(id, payload);
    if (updated) navigate(`/dashboard/school/${updated.id}`);
  }

  return (
    <div>
      <Navbar title="Editar instituição" />
      <div className="p-6">
        {loadingInstitution && (
          <p className="text-sm text-zinc-500">Carregando...</p>
        )}
        {!loadingInstitution && loadError && (
          <p className="text-sm text-red-600">{loadError}</p>
        )}
        {!loadingInstitution && institution && (
          <InstitutionForm
            initialInstitution={institution}
            submitting={submitting}
            error={submitError}
            submitLabel="Salvar alterações"
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/dashboard/school/${institution.id}`)}
          />
        )}
      </div>
    </div>
  );
}
