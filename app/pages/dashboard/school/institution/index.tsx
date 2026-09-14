import { FaSchool } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { ButtonIcon } from "~/components/atoms/ButtonIcon";
import { useDeleteInstitution } from "~/hooks/useDeleteInstitution";
import { useInstitution } from "~/hooks/useInstitution";
import { useToggleInstitutionStatus } from "~/hooks/useToggleInstitutionStatus";
import type { Institution } from "~/types/Institution";
import { formatCnpj } from "~/utils/cnpj";

export default function InstitutionDetail() {
  const { institutionId } = useParams();
  const navigate = useNavigate();

  const { institution, loading, error, refetch } = useInstitution(institutionId);

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
    <InstitutionDetailContent
      institution={institution}
      onRefetch={refetch}
      onBack={() => navigate("/dashboard/school")}
      onEdit={() => navigate(`/dashboard/school/${institution.id}/edit`)}
      onDeleted={() => navigate("/dashboard/school")}
    />
  );
}

interface InstitutionDetailContentProps {
  institution: Institution;
  onRefetch: () => void;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

function InstitutionDetailContent({
  institution,
  onRefetch,
  onBack,
  onEdit,
  onDeleted,
}: InstitutionDetailContentProps) {
  const navigate = useNavigate();
  const { deleting, deleteError, handleDelete } = useDeleteInstitution(
    institution,
    onDeleted,
  );
  const { toggling, toggleError, handleToggle } = useToggleInstitutionStatus(
    institution,
    onRefetch,
  );

  return (
    <main className="flex flex-1">
      <div className="flex w-full flex-col gap-8 px-12 py-16">
        <button
          type="button"
          onClick={onBack}
          className="w-fit cursor-pointer text-left text-xl text-slate-500 hover:underline"
        >
          Voltar
        </button>

        <div className="flex items-start justify-between gap-8">
          <div className="flex gap-6">
            <div className="flex h-20 w-20 min-h-24 min-w-24 items-center justify-center rounded-2xl bg-main">
              <FaSchool size={36} className="text-white" />
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-bold text-slate-900">
                {institution.name}
              </h1>
              <span
                className={`text-xl font-medium ${
                  institution.active ? "text-green-700" : "text-red-700"
                }`}
              >
                Status: {institution.active ? "Ativo" : "Desativado"}
              </span>
            </div>
          </div>

          <ButtonIcon onClick={onEdit}>
            <FiEdit2 size={28} className="text-slate-900" />
          </ButtonIcon>
        </div>

        <dl className="flex flex-col gap-2 text-xl text-slate-700">
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
            <dd>{institution.phone ?? "—"}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-bold">Endereço:</dt>
            <dd>{institution.address}</dd>
          </div>
        </dl>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="cursor-pointer rounded-lg border border-main/30 bg-white px-4 py-2 text-lg text-slate-900 hover:border-main"
          >
            Dispositivos
          </button>
          <button
            type="button"
            disabled
            title="Em breve"
            className="cursor-not-allowed rounded-lg border border-main/30 bg-white px-4 py-2 text-lg text-slate-400"
          >
            Turmas
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/scene")}
            className="cursor-pointer rounded-lg border border-main/30 bg-white px-4 py-2 text-lg text-slate-900 hover:border-main"
          >
            Cenários
          </button>
        </div>

        <div className="mt-auto flex flex-col items-end gap-2">
          {toggleError && <span className="text-sm text-red-500">{toggleError}</span>}
          {deleteError && <span className="text-sm text-red-500">{deleteError}</span>}

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
              {toggling ? "Salvando..." : institution.active ? "Desativar" : "Ativar"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
