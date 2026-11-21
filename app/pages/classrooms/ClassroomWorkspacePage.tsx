import clsx from "clsx";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TabBar, type TabItem } from "~/components/molecules/TabBar";
import { ClassroomDevicesTab } from "~/components/organisms/classrooms/ClassroomDevicesTab";
import { ClassroomFilesTab } from "~/components/organisms/classrooms/ClassroomFilesTab";
import { ClassroomPeople } from "~/components/organisms/classrooms/ClassroomPeople";
import { JoinCodePanel } from "~/components/organisms/classrooms/JoinCodePanel";
import { useClassroomDetails } from "~/hooks/classrooms/useClassroomDetails";
import {
  accentFor,
  buildStudentsCsv,
  downloadTextFile,
  fileSlug,
  formatDate,
  initialsOf,
} from "~/utils/classroomUi";

type WorkspaceTab = "inicio" | "arquivos" | "pessoas" | "dispositivos";

const BACK_PATH = "/classrooms";

/**
 * Espaço da turma, no estilo do Teams: cabeçalho colorido e abas
 * Início, Arquivos e Pessoas, mais Dispositivos para o professor.
 * Professor e aluno veem o mesmo espaço; o que é do professor (código,
 * exportação e dispositivos) só aparece para ele.
 */
export default function ClassroomWorkspacePage() {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    classroom,
    teachers,
    students,
    loading,
    error,
    refetch,
    isTeacher,
    isStudent,
    codeExpiresAt,
    generating,
    generateCode,
    leaving,
    leave,
  } = useClassroomDetails(classroomId);

  const rawTab = searchParams.get("tab");
  const tab: WorkspaceTab =
    rawTab === "arquivos" ||
    rawTab === "pessoas" ||
    (rawTab === "dispositivos" && isTeacher)
      ? rawTab
      : "inicio";

  function changeTab(next: WorkspaceTab) {
    setSearchParams(next === "inicio" ? {} : { tab: next }, { replace: true });
  }

  if (loading && !classroom) {
    return (
      <Main>
        <Alert message="Carregando turma..." type="muted" />
      </Main>
    );
  }

  if (!classroom) {
    return (
      <Main>
        <PageTitle
          title="Turma"
          description="Não foi possível abrir esta turma"
          backPath={BACK_PATH}
        />
        <Alert message={error ?? "Turma não encontrada."} type="error" />
      </Main>
    );
  }

  const accent = accentFor(classroom.id, classroom.archived);

  const tabs: TabItem<WorkspaceTab>[] = [
    { id: "inicio", label: "Início" },
    { id: "arquivos", label: "Arquivos" },
    { id: "pessoas", label: "Pessoas", count: teachers.length + students.length },
  ];

  if (isTeacher) {
    tabs.push({ id: "dispositivos", label: "Dispositivos" });
  }

  async function handleLeave() {
    if (!classroom) return;
    if (!window.confirm(`Sair da turma ${classroom.title}?`)) return;

    if (await leave()) {
      navigate(BACK_PATH, { replace: true });
    }
  }

  function handleExport() {
    if (!classroom) return;

    downloadTextFile(
      `alunos-${fileSlug(classroom.title)}-${classroom.period.replace("/", "-")}.csv`,
      buildStudentsCsv(students),
    );
  }

  return (
    <Main>
      <PageTitle
        title="Turma"
        description={isTeacher ? "Espaço do professor" : "Espaço do aluno"}
        backPath={BACK_PATH}
      />

      <header className="shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div
          className={clsx(
            "flex flex-wrap items-center gap-3 px-4 py-4 text-white sm:gap-5 sm:px-8 sm:py-6",
            accent.banner,
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold sm:size-16 sm:text-2xl",
              accent.text,
            )}
          >
            {initialsOf(classroom.title)}
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold wrap-anywhere sm:line-clamp-2 sm:text-3xl">
              {classroom.title}
            </h2>
            <p className="text-lg text-white/90 wrap-anywhere">
              Período {classroom.period}
              {classroom.archived ? ", arquivada" : ""}
            </p>
          </div>

          {isStudent && (
            <div className="w-full sm:w-40">
              <Button
                label={leaving ? "Saindo..." : "Sair da turma"}
                variant="muted"
                disabled={leaving}
                onClick={handleLeave}
              />
            </div>
          )}
        </div>

        <TabBar
          label="Seções da turma"
          tabs={tabs}
          active={tab}
          onChange={changeTab}
          className="px-3 max-sm:flex-wrap max-sm:[&>button]:min-w-0 max-sm:[&>button]:px-2 max-sm:[&>button]:text-base max-[480px]:grid max-[480px]:grid-cols-2 max-[480px]:gap-y-0 sm:px-4"
        />
      </header>

      <div
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="min-w-0 wrap-anywhere"
      >
        {classroom.archived && (
          <div className="mb-6">
            <Alert
              message="Esta turma está arquivada e não aceita novos alunos."
              type="muted"
            />
          </div>
        )}

        {tab === "inicio" && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <Card className="max-lg:p-4">
              <h2 className="text-2xl font-bold text-slate-900">Sobre a turma</h2>

              <p className="whitespace-pre-line text-lg text-slate-700">
                {classroom.description || "Esta turma ainda não tem descrição."}
              </p>

              <dl className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,6rem),1fr))]">
                <div>
                  <dt className="text-base text-slate-500">Criada em</dt>
                  <dd className="text-lg font-bold text-slate-900">
                    {formatDate(classroom.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-base text-slate-500">Professores</dt>
                  <dd className="text-lg font-bold text-slate-900">
                    {teachers.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-base text-slate-500">Alunos</dt>
                  <dd className="text-lg font-bold text-slate-900">
                    {students.length}
                  </dd>
                </div>
              </dl>
            </Card>

            <div className="flex flex-col gap-6">
              {isTeacher && (
                <JoinCodePanel
                  code={classroom.joinCode}
                  expiresAt={codeExpiresAt}
                  archived={classroom.archived}
                  generating={generating}
                  onGenerate={generateCode}
                  onExpired={refetch}
                />
              )}

              <Card className="max-lg:p-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {teachers.length === 1 ? "Professor" : "Professores"}
                </h2>

                {teachers.length === 0 ? (
                  <p className="text-base text-slate-600">
                    Nenhum professor vinculado a esta turma.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {teachers.map((teacher) => (
                      <li key={teacher.userId} className="min-w-0">
                        <p className="text-lg font-bold text-slate-900 sm:truncate">
                          {teacher.name}
                        </p>
                        <p className="text-base text-slate-600 sm:truncate">
                          {teacher.email}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        )}

        {tab === "arquivos" && <ClassroomFilesTab classroomId={classroom.id} isTeacher={isTeacher} archived={classroom.archived} />}

        {tab === "pessoas" && (
          <ClassroomPeople
            teachers={teachers}
            students={students}
            canSeeStudentDetails={isTeacher}
            onExport={isTeacher ? handleExport : undefined}
          />
        )}

        {isTeacher && tab === "dispositivos" && (
          <ClassroomDevicesTab
            classroomId={classroom.id}
            isTeacher
            archived={classroom.archived}
          />
        )}
      </div>
    </Main>
  );
}
