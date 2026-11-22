import { useEffect, useState } from "react";
import { useConfirmation } from "~/context/ConfirmationContext";
import { useNavigate, useParams } from "react-router";
import {
  archiveClassroom,
  createClassroom,
  deleteClassroom,
  findClassrooms,
  unarchiveClassroom,
  updateClassroom,
} from "~/api/classrooms";
import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { ClassroomFormModal } from "~/components/organisms/ClassroomFormModal";
import { ClassroomCard } from "~/components/organisms/classrooms/ClassroomCard";
import { useAuth } from "~/context/AuthContext";
import type { Classroom, ClassroomRequest } from "~/types/Classroom";

type ModalState =
  | { type: "create" }
  | { type: "edit"; classroom: Classroom }
  | null;

/**
 * Turmas de uma instituição. O gestor cria, edita, arquiva e exclui;
 * o administrador só consulta (o backend não libera essas ações para ele).
 */
export default function ClassroomsPage() {
  const confirmAction = useConfirmation();
  const navigate = useNavigate();
  const { institutionId } = useParams();
  const { user } = useAuth();
  const isManager = user?.role === "MANAGER";

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [refetchKey, setRefetchKey] = useState(0);
  const [modal, setModal] = useState<ModalState>(null);

  useEffect(() => {
    setLoading(true);

    findClassrooms({ name: appliedSearch, page: 0, size: 50, institutionId })
      .then((result) => setClassrooms(result.content))
      .catch(() => setClassrooms([]))
      .finally(() => setLoading(false));
  }, [appliedSearch, institutionId, refetchKey]);

  function reload() {
    setRefetchKey((key) => key + 1);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAppliedSearch(search.trim());
  }

  async function handleSave(data: ClassroomRequest) {
    if (modal?.type === "edit") {
      await updateClassroom(modal.classroom.id, data);
    } else {
      await createClassroom(data);
    }

    setModal(null);
    reload();
  }

  async function run(action: () => Promise<void>) {
    try {
      await action();
      reload();
    } catch {
      // o interceptor do axios já mostrou o erro
    }
  }

  async function handleDelete(classroom: Classroom) {
    const confirmed = await confirmAction({
      title: "Excluir turma",
      description: `Excluir a turma ${classroom.title}?`,
      confirmLabel: "Excluir",
      variant: "danger",
    });
    if (!confirmed) return;
    run(() => deleteClassroom(classroom.id));
  }

  // RNF16: arquivar exige confirmação explícita; reativar também confirma, para
  // o gestor não liberar por engano uma turma encerrada
  async function handleToggleArchive(classroom: Classroom) {
    const confirmed = classroom.archived
      ? await confirmAction({
          title: "Reativar turma",
          description: `Reativar a turma ${classroom.title}? Ela volta a aceitar edições, novos membros, materiais e o uso dos simuladores vinculados.`,
          confirmLabel: "Reativar",
          variant: "primary",
        })
      : await confirmAction({
          title: "Arquivar turma",
          description: `Arquivar a turma ${classroom.title}? Ela fica somente leitura: não poderá ser editada, não gera código de convite nem aceita novos membros, não recebe materiais e os simuladores vinculados deixam de receber cenários. Você poderá reativá-la depois.`,
          confirmLabel: "Arquivar",
          variant: "danger",
        });
    if (!confirmed) return;

    run(() =>
      classroom.archived
        ? unarchiveClassroom(classroom.id)
        : archiveClassroom(classroom.id),
    );
  }

  const management = isManager
    ? {
        onEdit: (classroom: Classroom) => setModal({ type: "edit", classroom }),
        onDelete: handleDelete,
        onToggleArchive: handleToggleArchive,
      }
    : undefined;

  return (
    <Main>
      <PageTitle
        title="Turmas"
        description={
          isManager
            ? "Crie e gerencie as turmas da sua instituição"
            : "Consulte as turmas desta instituição"
        }
        backPath={`/institutions/${institutionId}`}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <form className="w-full sm:w-96 sm:max-w-full" onSubmit={handleSearch}>
          <SearchBar value={search} onChange={setSearch} />
        </form>

        {isManager && (
          <div className="w-full sm:w-36">
            <Button
              label="Nova Turma"
              onClick={() => setModal({ type: "create" })}
            />
          </div>
        )}
      </div>

      {loading && <Alert message="Carregando turmas..." type="muted" />}

      {!loading && classrooms.length === 0 && (
        <Alert message="Nenhuma turma encontrada." type="muted" />
      )}

      <ul className="grid gap-4 md:grid-cols-2">
        {classrooms.map((classroom) => (
          <li key={classroom.id} className="min-w-0">
            <ClassroomCard
              classroom={classroom}
              onOpen={() =>
                navigate(`/institutions/${institutionId}/classrooms/${classroom.id}`)
              }
              management={management}
            />
          </li>
        ))}
      </ul>

      {modal && (
        <ClassroomFormModal
          isOpen
          classroom={modal.type === "edit" ? modal.classroom : undefined}
          onClose={() => setModal(null)}
          onSubmit={handleSave}
        />
      )}
    </Main>
  );
}
