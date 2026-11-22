import { useEffect, useRef, useState } from "react";
import { assignClassroomDevice, findClassroomDevices, removeClassroomDevice } from "~/api/classroomDesvices";
import { findClassrooms } from "~/api/classrooms";
import { findDevices } from "~/api/devices";
import { useConfirmation } from "~/context/ConfirmationContext";

import type { Classroom } from "~/types/Classroom";
import type { DeviceInfo } from "~/types/device";

const PAGE_SIZE = 10;

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}

async function loadClassrooms(institutionId: string): Promise<Classroom[]> {
  const classrooms: Classroom[] = [];
  let page = 0;

  while (true) {
    const response = await findClassrooms({
      institutionId,
      page,
      size: 100,
    });

    classrooms.push(
      ...response.content.filter(
        (classroom) => classroom.institutionId === institutionId,
      ),
    );

    page++;

    if (page >= response.totalPages) {
      break;
    }
  }

  return classrooms.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
}

/**
 * O id inicial vem da URL, quando o gestor abre a página já apontando para
 * uma turma. Se a turma não pertencer à instituição, a primeira da lista é
 * selecionada automaticamente.
 */
export function useClassroomDevices(
  institutionId: string,
  initialClassroomId = "",
) {
  const confirmAction = useConfirmation();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [classroomId, setClassroomId] = useState(initialClassroomId);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [linkedDevices, setLinkedDevices] = useState<DeviceInfo[]>([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const [loadingClassrooms, setLoadingClassrooms] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [classroomsError, setClassroomsError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  const savingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    setLoadingClassrooms(true);
    setClassroomsError(null);

    loadClassrooms(institutionId)
      .then((result) => {
        if (cancelled) return;

        setClassrooms(result);
        setClassroomId((current) =>
          result.some((classroom) => classroom.id === current)
            ? current
            : (result[0]?.id ?? ""),
        );
      })
      .catch((cause: unknown) => {
        if (cancelled) return;

        setClassrooms([]);
        setClassroomId("");
        setClassroomsError(errorMessage(cause));
      })
      .finally(() => {
        if (!cancelled) setLoadingClassrooms(false);
      });

    return () => {
      cancelled = true;
    };
  }, [institutionId, revision]);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    Promise.all([
      findDevices({
        institutionId,
        name: search,
        page,
        size: PAGE_SIZE,
      }),
      classroomId
        ? findClassroomDevices(classroomId)
        : Promise.resolve<DeviceInfo[]>([]),
    ])
      .then(([devicePage, linked]) => {
        if (cancelled) return;

        setDevices(devicePage.content);
        setTotalPages(devicePage.totalPages);
        setLinkedDevices(linked);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;

        setDevices([]);
        setLinkedDevices([]);
        setError(errorMessage(cause));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [institutionId, classroomId, search, page, revision]);

  const classroom = classrooms.find((item) => item.id === classroomId);

  const busy = loading || loadingClassrooms || saving;

  function refresh() {
    setLoading(true);
    setLoadingClassrooms(true);
    setRevision((current) => current + 1);
  }

  function selectClassroom(id: string) {
    if (id === classroomId || busy) return;

    setLoading(true);
    setClassroomId(id);
    setMessage(null);
    setError(null);
  }

  function applySearch(value: string) {
    if (busy) return;

    const nextSearch = value.trim();

    if (nextSearch === search && page === 0) {
      refresh();
      return;
    }

    setLoading(true);
    setSearch(nextSearch);
    setPage(0);
    setMessage(null);
  }

  function changePage(nextPage: number) {
    if (busy || nextPage < 0 || nextPage >= totalPages || nextPage === page) {
      return;
    }

    setLoading(true);
    setPage(nextPage);
  }

  async function mutate(action: () => Promise<void>, successMessage: string) {
    if (busy || savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await action();
      setMessage(successMessage);
      refresh();
    } catch (cause: unknown) {
      setError(errorMessage(cause));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  async function assign(device: DeviceInfo) {
    if (
      busy ||
      !classroom ||
      classroom.archived ||
      device.institutionId !== institutionId ||
      device.status === "PENDING" ||
      device.classroomId === classroom.id
    ) {
      return;
    }

    if (device.classroomId) {
      const previous = classrooms.find(
        (item) => item.id === device.classroomId,
      );

      const confirmed = await confirmAction({
        title: "Transferir dispositivo",
        description: `Transferir "${device.name || device.hardwareId}" de ` +
          `"${previous?.title ?? "outra turma"}" para ` +
          `"${classroom.title}"? O vínculo anterior será substituído.`,
        confirmLabel: "Transferir",
      });

      if (!confirmed) return;
    }

    void mutate(
      () => assignClassroomDevice(classroom.id, device.id),
      "Dispositivo atribuído à turma.",
    );
  }

  async function remove(device: DeviceInfo) {
    if (busy || !classroom) return;

    const confirmed = await confirmAction({
      title: "Remover dispositivo da turma",
      description: `Remover "${device.name || device.hardwareId}" ` +
        `da turma "${classroom.title}"?`,
      confirmLabel: "Remover vínculo",
      variant: "danger",
    });

    if (!confirmed) return;

    void mutate(
      () => removeClassroomDevice(classroom.id, device.id),
      "Vínculo removido.",
    );
  }

  return {
    classrooms,
    classroom,
    classroomId,
    devices,
    linkedDevices,
    page,
    totalPages,
    loading,
    loadingClassrooms,
    busy,
    error: classroomsError ?? error,
    message,
    refresh,
    selectClassroom,
    applySearch,
    changePage,
    assign,
    remove,
  };
}
