import { useEffect, useRef, useState } from "react";

import { findClassroomById } from "~/api/classrooms";
import type { ClassroomLabel } from "~/types/Classroom";
import type { DeviceInfo } from "~/types/device";

export function useClassroomLabels(
  devices: DeviceInfo[],
): Map<string, ClassroomLabel> {
  const [labels, setLabels] = useState<Map<string, ClassroomLabel>>(new Map());
  const cacheRef = useRef(new Map<string, ClassroomLabel>());

  useEffect(() => {
    let cancelled = false;

    // Busca apenas as turmas ainda não conhecidas da página atual.
    const missingIds = [
      ...new Set(
        devices
          .map((device) => device.classroomId)
          .filter(
            (id): id is string =>
              id !== null && !cacheRef.current.has(id),
          ),
      ),
    ];

    if (missingIds.length === 0) return;

    void Promise.allSettled(
      missingIds.map((id) => findClassroomById(id)),
    ).then((results) => {
      if (cancelled) return;

      const next = new Map(cacheRef.current);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const classroom = result.value;

          next.set(missingIds[index], {
            title: classroom.title,
            period: classroom.period,
            archived: classroom.archived,
          });
        }
      });

      cacheRef.current = next;
      setLabels(next);
    });

    return () => {
      cancelled = true;
    };
  }, [devices]);

  return labels;
}
