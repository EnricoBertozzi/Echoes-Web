import { useEffect, useState } from "react";
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
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { ClassroomFormModal } from "~/components/organisms/ClassroomFormModal";
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

  function handleDelete(classroom: Classroom) {
    if (!window.confirm(`Excluir a turma ${classroom.title}?`)) return;
    run(() => deleteClassroom(classroom.id));
  }

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

      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <form className="w-96" onSubmit={handleSearch}>
          <SearchBar value={search} onChange={setSearch} />
        </form>

        {isManager && (
          <div className="w-36">
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
          <li key={classroom.id}>
            <Card>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-2xl font-bold text-slate-900">
                    {classroom.title}
                  </h3>
                  <p className="text-xl text-slate-500">
                    Período: {classroom.period}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold ${
                    classroom.archived
                      ? "bg-stone-200 text-stone-600"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {classroom.archived ? "Arquivada" : "Ativa"}
                </span>
              </div>

              {classroom.description && (
                <p className="line-clamp-3 text-lg text-slate-700">
                  {classroom.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <div className="w-28">
                  <Button
                    label="Abrir"
                    onClick={() =>
                      navigate(
                        `/institutions/${institutionId}/classrooms/${classroom.id}`,
                      )
                    }
                  />
                </div>

                {isManager && (
                  <>
                    <div className="w-28">
                      <Button
                        label="Editar"
                        variant="muted"
                        disabled={classroom.archived}
                        onClick={() => setModal({ type: "edit", classroom })}
                      />
                    </div>
                    <div className="w-32">
                      <Button
                        label={classroom.archived ? "Desarquivar" : "Arquivar"}
                        variant="muted"
                        onClick={() =>
                          run(() =>
                            classroom.archived
                              ? unarchiveClassroom(classroom.id)
                              : archiveClassroom(classroom.id),
                          )
                        }
                      />
                    </div>
                    <div className="w-28">
                      <Button
                        label="Excluir"
                        variant="danger"
                        onClick={() => handleDelete(classroom)}
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
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
