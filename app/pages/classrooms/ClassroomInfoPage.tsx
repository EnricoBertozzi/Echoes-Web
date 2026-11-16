import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  addClassroomMember,
  clearClassroomStudents,
  findClassroomById,
  findClassroomMembers,
  removeClassroomMember,
} from "~/api/classrooms";
import { findAllUsers } from "~/api/users";
import { Button } from "~/components/atoms/Button";
import { SelectInput } from "~/components/atoms/input/SelectInput";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { UserCard } from "~/components/molecules/users/UserCard";
import { useAuth } from "~/context/AuthContext";
import type { Classroom, ClassroomMember } from "~/types/Classroom";
import type { User } from "~/types/user";

/**
 * Detalhe da turma. O gestor adiciona professor e remove membros;
 * o administrador só consulta os membros.
 */
export default function ClassroomInfoPage() {
  const { institutionId, classroomId } = useParams();
  const { user } = useAuth();
  const isManager = user?.role === "MANAGER";

  const [classroom, setClassroom] = useState<Classroom>();
  const [members, setMembers] = useState<ClassroomMember[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refetchKey, setRefetchKey] = useState(0);

  const backPath = `/institutions/${institutionId}/classrooms`;

  useEffect(() => {
    if (!classroomId) return;

    setLoading(true);

    Promise.all([
      findClassroomById(classroomId),
      findClassroomMembers(classroomId, 0, 100),
    ])
      .then(([classroomResult, membersResult]) => {
        setClassroom(classroomResult);
        setMembers(membersResult.content);
      })
      .catch(() => {
        // o interceptor do axios já mostrou o erro
      })
      .finally(() => setLoading(false));
  }, [classroomId, refetchKey]);

  // professores da instituição, para o gestor adicionar à turma
  useEffect(() => {
    if (!isManager || !user?.institutionId) return;

    findAllUsers("teacher", {
      page: 0,
      size: 100,
      institutionId: user.institutionId,
    })
      .then((response) => setTeachers(response.data.content))
      .catch(() => {});
  }, [isManager, user?.institutionId]);

  function reload() {
    setRefetchKey((key) => key + 1);
  }

  async function run(action: () => Promise<void>) {
    try {
      await action();
      reload();
    } catch {
      // o interceptor do axios já mostrou o erro
    }
  }

  function handleAddTeacher() {
    if (!classroomId || !teacherId) return;
    run(async () => {
      await addClassroomMember(classroomId, teacherId);
      setTeacherId("");
    });
  }

  function handleRemove(member: ClassroomMember) {
    if (!classroomId) return;
    if (!window.confirm(`Remover ${member.name} da turma?`)) return;
    run(() => removeClassroomMember(classroomId, member.userId));
  }

  function handleClearStudents() {
    if (!classroomId) return;
    if (!window.confirm("Remover todos os alunos da turma?")) return;
    run(() => clearClassroomStudents(classroomId));
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
          description="Turma não encontrada"
          backPath={backPath}
        />
      </Main>
    );
  }

  const memberIds = new Set(members.map((member) => member.userId));
  const teacherOptions = new Map<string, string>(
    teachers
      .filter((teacher) => !memberIds.has(teacher.id))
      .map((teacher): [string, string] => [teacher.id, teacher.name]),
  );

  return (
    <Main>
      <PageTitle
        title={classroom.title}
        description={`Período ${classroom.period}${
          classroom.archived ? " · Arquivada" : ""
        }`}
        backPath={backPath}
      />

      {classroom.description && (
        <p className="text-xl text-slate-700">{classroom.description}</p>
      )}

      {isManager && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-72">
            <SelectInput
              id="teacher"
              name="teacher"
              placeholder="Escolha um professor"
              options={teacherOptions}
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
            />
          </div>

          <div className="w-56">
            <Button
              label="Adicionar professor"
              disabled={!teacherId}
              onClick={handleAddTeacher}
            />
          </div>

          <div className="w-56">
            <Button
              label="Remover todos os alunos"
              variant="danger"
              onClick={handleClearStudents}
            />
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-slate-900">
        Membros ({members.length})
      </h2>

      {members.length === 0 ? (
        <Alert message="Nenhum membro nesta turma." type="muted" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <UserCard
              key={member.userId}
              name={member.name}
              email={member.email}
              role={member.role}
              onDelete={isManager ? () => handleRemove(member) : undefined}
            />
          ))}
        </div>
      )}
    </Main>
  );
}
