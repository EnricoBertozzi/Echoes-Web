import { useNavigate } from "react-router";
import { InstitutionForm } from "~/components/organisms/InstitutionForm";
import { Navbar } from "~/components/molecules/Navbar";
import { useCreateInstitution } from "~/hooks/useCreateInstitution";
import type { Route } from "./+types/new";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Nova instituição — Echoes" }];
}

export default function NewInstitutionPage() {
  const navigate = useNavigate();
  const { create, loading, error } = useCreateInstitution();

  async function handleSubmit(payload: Parameters<typeof create>[0]) {
    const created = await create(payload);
    if (created) navigate(`/dashboard/school/${created.id}`);
  }

  return (
    <div>
      <Navbar title="Adicionar Instituição" />
      <div className="p-6">
        <InstitutionForm
          submitting={loading}
          error={error}
          submitLabel="Cadastrar"
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard/school")}
        />
      </div>
    </div>
  );
}
