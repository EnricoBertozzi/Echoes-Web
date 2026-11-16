import { useState } from "react";
import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { SearchBar } from "~/components/atoms/SearchBar";
import type { ClassroomMember } from "~/types/Classroom";
import { formatDate } from "~/utils/classroomUi";

export interface ClassroomPeopleProps {
  teachers: ClassroomMember[];
  students: ClassroomMember[];
  /** professor vê e-mail e data de ingresso; aluno vê só o nome dos colegas */
  canSeeStudentDetails: boolean;
  onExport?: () => void;
}

interface PersonRowProps {
  member: ClassroomMember;
  showEmail: boolean;
  showJoinedAt: boolean;
}

function PersonRow({ member, showEmail, showJoinedAt }: PersonRowProps) {
  return (
    <li className="flex items-center gap-4 py-3">
      <span
        aria-hidden="true"
        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-main text-lg font-bold text-white"
      >
        {member.name.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold text-slate-900">
          {member.name}
        </p>

        {showEmail && (
          <p className="truncate text-base text-slate-600">{member.email}</p>
        )}
      </div>

      {showJoinedAt && (
        <p className="hidden shrink-0 text-base text-slate-500 sm:block">
          Ingressou em {formatDate(member.joinedAt)}
        </p>
      )}
    </li>
  );
}

function matches(member: ClassroomMember, term: string) {
  if (!term) return true;
  const needle = term.toLocaleLowerCase("pt-BR");
  return (
    member.name.toLocaleLowerCase("pt-BR").includes(needle) ||
    member.email.toLocaleLowerCase("pt-BR").includes(needle)
  );
}

/** Aba "Pessoas": professores e alunos, com busca e exportação para o professor. */
export function ClassroomPeople({
  teachers,
  students,
  canSeeStudentDetails,
  onExport,
}: ClassroomPeopleProps) {
  const [search, setSearch] = useState("");

  const term = search.trim();
  const filteredTeachers = teachers.filter((member) => matches(member, term));
  const filteredStudents = students.filter((member) =>
    canSeeStudentDetails ? matches(member, term) : matches({ ...member, email: "" }, term),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <form className="w-96 max-w-full" onSubmit={(e) => e.preventDefault()}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar pessoas..."
          />
        </form>

        {onExport && (
          <div className="flex w-56 items-center">
            <Button
              label="Exportar alunos (CSV)"
              variant="muted"
              disabled={students.length === 0}
              onClick={onExport}
            />
          </div>
        )}
      </div>

      <Card>
        <h2 className="text-2xl font-bold text-slate-900">
          Professores ({filteredTeachers.length})
        </h2>

        {filteredTeachers.length === 0 ? (
          <Alert message="Nenhum professor encontrado." type="muted" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredTeachers.map((member) => (
              <PersonRow
                key={member.userId}
                member={member}
                showEmail
                showJoinedAt={false}
              />
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="text-2xl font-bold text-slate-900">
          Alunos ({filteredStudents.length})
        </h2>

        {filteredStudents.length === 0 ? (
          <Alert
            message={
              students.length === 0
                ? "Nenhum aluno entrou nesta turma ainda."
                : "Nenhum aluno encontrado."
            }
            type="muted"
          />
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredStudents.map((member) => (
              <PersonRow
                key={member.userId}
                member={member}
                showEmail={canSeeStudentDetails}
                showJoinedAt={canSeeStudentDetails}
              />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
