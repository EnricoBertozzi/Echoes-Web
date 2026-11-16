import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { joinClassroom } from "~/api/classrooms";
import { Button } from "~/components/atoms/Button";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { TabBar, type TabItem } from "~/components/molecules/TabBar";
import { JoinClassroomModal } from "~/components/organisms/JoinClassroomModal";
import { ClassroomTile } from "~/components/organisms/classrooms/ClassroomTile";
import { useAuth } from "~/context/AuthContext";
import { useMyClassrooms } from "~/hooks/classrooms/useMyClassrooms";

type StatusTab = "active" | "archived";

/**
 * Turmas do professor ou do aluno logado (o backend já devolve só as turmas
 * em que a pessoa participa). O aluno também entra em uma turma pelo código.
 */
export default function MyClassroomsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isStudent = user?.role === "STUDENT";

  const { classrooms, loading, error, refetch } = useMyClassrooms();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusTab>("active");
  const [joinOpen, setJoinOpen] = useState(false);

  const term = search.trim().toLocaleLowerCase("pt-BR");

  const searched = useMemo(
    () =>
      classrooms.filter((classroom) =>
        classroom.title.toLocaleLowerCase("pt-BR").includes(term),
      ),
    [classrooms, term],
  );

  const active = searched.filter((classroom) => !classroom.archived);
  const archived = searched.filter((classroom) => classroom.archived);
  const visible = status === "active" ? active : archived;

  const tabs: TabItem<StatusTab>[] = [
    { id: "active", label: "Ativas", count: active.length },
    { id: "archived", label: "Arquivadas", count: archived.length },
  ];

  // o backend permite ao aluno estar em uma única turma (mesmo arquivada)
  const alreadyEnrolled = isStudent && classrooms.length > 0;

  async function handleJoin(code: string) {
    const joined = await joinClassroom({ code });

    setJoinOpen(false);
    navigate(`/classrooms/${joined.id}`);
  }

  function emptyMessage() {
    if (term) return "Nenhuma turma encontrada para essa busca.";
    if (status === "archived") return "Você não tem turmas arquivadas.";
    if (isStudent) {
      return "Você ainda não entrou em nenhuma turma. Use o código que seu professor compartilhou.";
    }
    return "Você ainda não participa de nenhuma turma. O gestor da instituição adiciona professores às turmas.";
  }

  return (
    <Main>
      <PageTitle
        title="Turmas"
        description={
          isStudent
            ? "Acompanhe sua turma e entre com o código do professor"
            : "Gerencie as turmas em que você leciona"
        }
      />

      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <form className="w-96 max-w-full" onSubmit={(e) => e.preventDefault()}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar turma..."
          />
        </form>

        {isStudent && (
          <div className="w-48">
            <Button
              label="Entrar em turma"
              disabled={loading || alreadyEnrolled}
              onClick={() => setJoinOpen(true)}
            />
          </div>
        )}
      </div>

      {alreadyEnrolled && (
        <p className="text-base text-slate-600">
          Você já participa de uma turma. Para entrar em outra, saia dela
          primeiro.
        </p>
      )}

      <TabBar
        label="Status das turmas"
        tabs={tabs}
        active={status}
        onChange={setStatus}
      />

      <div id={`panel-${status}`} role="tabpanel" aria-labelledby={`tab-${status}`}>
        {loading && <Alert message="Carregando turmas..." type="muted" />}

        {!loading && error && (
          <div className="flex flex-col items-start gap-4">
            <Alert message={error} type="error" />
            <div className="w-48">
              <Button label="Tentar de novo" variant="muted" onClick={refetch} />
            </div>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <Alert message={emptyMessage()} type="muted" />
        )}

        {!loading && !error && visible.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 2xl:grid-cols-3">
            {visible.map((classroom) => (
              <li key={classroom.id} className="min-w-0">
                <ClassroomTile classroom={classroom} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {joinOpen && (
        <JoinClassroomModal
          isOpen
          onClose={() => setJoinOpen(false)}
          onSubmit={handleJoin}
        />
      )}
    </Main>
  );
}
