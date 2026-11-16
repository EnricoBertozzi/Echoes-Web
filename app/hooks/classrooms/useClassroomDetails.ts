import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  findAllClassroomMembers,
  findClassroomById,
  generateClassroomCode,
  leaveClassroom,
} from "~/api/classrooms";
import { ApiRequestError } from "~/api/errors";
import { useAuth } from "~/context/AuthContext";
import type { Classroom, ClassroomMember } from "~/types/Classroom";

function byName(a: ClassroomMember, b: ClassroomMember) {
  return a.name.localeCompare(b.name, "pt-BR");
}

export function useClassroomDetails(classroomId: string | undefined) {
  const { user, loading: authLoading } = useAuth();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [members, setMembers] = useState<ClassroomMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  // o backend só informa o tempo restante quando o código é gerado agora;
  // numa consulta posterior vem só o código, sem prazo
  const [codeExpiresAt, setCodeExpiresAt] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const latestRequestRef = useRef(0);

  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const requestId = ++latestRequestRef.current;

    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!classroomId) {
      setClassroom(null);
      setMembers([]);
      setLoading(false);
      setError("Turma não encontrada.");
      return;
    }

    setLoading(true);
    setError(null);

    void Promise.all([
      findClassroomById(classroomId),
      findAllClassroomMembers(classroomId),
    ])
      .then(([classroomResult, membersResult]) => {
        if (latestRequestRef.current !== requestId) return;

        setClassroom(classroomResult);
        setMembers(membersResult);

        if (!classroomResult.joinCode) {
          setCodeExpiresAt(null);
        }
      })
      .catch((caught: unknown) => {
        if (latestRequestRef.current !== requestId) return;

        setClassroom(null);
        setMembers([]);
        setError(
          caught instanceof ApiRequestError && caught.status === 403
            ? "Você não tem acesso a esta turma."
            : caught instanceof Error
              ? caught.message
              : "Erro ao carregar a turma.",
        );
      })
      .finally(() => {
        if (latestRequestRef.current === requestId) {
          setLoading(false);
        }
      });
  }, [authLoading, classroomId, refetchKey]);

  const refetch = useCallback(() => {
    setRefetchKey((key) => key + 1);
  }, []);

  const teachers = useMemo(
    () => members.filter((member) => member.role === "TEACHER").sort(byName),
    [members],
  );

  const students = useMemo(
    () => members.filter((member) => member.role === "STUDENT").sort(byName),
    [members],
  );

  const generateCode = useCallback(async () => {
    if (!classroomId || !isTeacher) return;

    setGenerating(true);

    try {
      const result = await generateClassroomCode(classroomId);

      setClassroom((current) =>
        current ? { ...current, joinCode: result.code } : current,
      );
      setCodeExpiresAt(Date.now() + result.expiresInSeconds * 1000);
    } catch {
      // o interceptor do axios já mostrou o erro (ex.: código anterior ainda ativo)
    } finally {
      setGenerating(false);
    }
  }, [classroomId, isTeacher]);

  // devolve true quando saiu, para a página decidir o redirecionamento
  const leave = useCallback(async (): Promise<boolean> => {
    if (!classroomId) return false;

    setLeaving(true);

    try {
      await leaveClassroom(classroomId);
      return true;
    } catch {
      return false;
    } finally {
      setLeaving(false);
    }
  }, [classroomId]);

  return {
    classroom,
    members,
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
  };
}
