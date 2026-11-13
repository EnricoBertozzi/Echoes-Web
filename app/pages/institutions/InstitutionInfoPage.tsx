import { FaSchool } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { ButtonIcon } from "~/components/atoms/ButtonIcon";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { useAuth } from "~/context/AuthContext";
import { useDeleteInstitution } from "~/hooks/useDeleteInstitution";
import { useInstitution } from "~/hooks/useInstitution";
import { useToggleInstitutionStatus } from "~/hooks/useToggleInstitutionStatus";
import type { Institution } from "~/types/Institution";
import { formatCnpj } from "~/utils/cnpj";

export default function InstitutionDetail() {
  const { institutionId } = useParams();
  const navigate = useNavigate();

  const { institution, loading, error, refetch } =
    useInstitution(institutionId);

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

  return (
    <InstitutionInfoPage
      institution={institution}
      onRefetch={refetch}
      onBack={() => navigate("/institutions")}
      onEdit={() => navigate(`/institutions/${institution.id}/edit`)}
      onDeleted={() => navigate("/institutions")}
    />
  );
}

interface InstitutionInfoPageProps {
  institution: Institution;
  onRefetch: () => void;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

function InstitutionInfoPage({
  institution,
  onRefetch,
  onBack,
  onEdit,
  onDeleted,
}: InstitutionInfoPageProps) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { deleting, deleteError, handleDelete } = useDeleteInstitution(
    institution,
    onDeleted,
  );
  const { toggling, toggleError, handleToggle } = useToggleInstitutionStatus(
    institution,
    onRefetch,
  );

  return (
    <Main>
      {user?.role === "ADMIN" ? (
        <PageTitle
          backPath="/institutions"
          title={institution.name}
          description={institution.id}
        />
      ) : (
        <PageTitle title={institution.name} description={institution.id} />
      )}

      <dl className="flex flex-col gap-2 text-xl text-slate-700">
        <span
          className={`text-xl font-medium ${
            institution.active ? "text-green-700" : "text-red-700"
          }`}
        >
          Status: {institution.active ? "Ativo" : "Desativado"}
        </span>
        <div className="flex gap-2">
          <dt className="font-bold">CNPJ:</dt>
          <dd>{formatCnpj(institution.cnpj)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold">Email:</dt>
          <dd>{institution.email}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold">Telefone:</dt>
          <dd>{institution.phone ?? "-"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-bold">Endereço:</dt>
          <dd>{institution.address}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-4">
        <div className="w-24">
          <Button
            label={"Membros"}
            onClick={() => navigate(`/institutions/${institution.id}/users`)}
            variant={"primary"}
          />
        </div>
        <button
          type="button"
          disabled
          title="Em breve"
          className="cursor-not-allowed rounded-lg border border-main/30 bg-white px-4 py-2 text-lg text-slate-400"
        >
          Turmas
        </button>
      </div>

      <div className="mt-auto flex flex-col items-end gap-2">
        {toggleError && (
          <span className="text-sm text-red-500">{toggleError}</span>
        )}
        {deleteError && (
          <span className="text-sm text-red-500">{deleteError}</span>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex cursor-pointer items-center gap-2 rounded px-4 py-2 text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiTrash2 size={20} />
            Excluir
          </button>

          <button
            type="button"
            onClick={handleToggle}
            disabled={toggling}
            className={`cursor-pointer rounded-lg px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50 ${
              institution.active ? "bg-red-700" : "bg-green-700"
            }`}
          >
            {toggling
              ? "Salvando..."
              : institution.active
                ? "Desativar"
                : "Ativar"}
          </button>
          <div className="w-24">
            <Button label={"Editar"} onClick={onEdit} variant={"primary"} />
          </div>
        </div>
      </div>
    </Main>
  );
}
