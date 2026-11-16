import { useCallback, useEffect, useRef, useState } from "react";
import {
  createClassroomMaterial,
  deleteClassroomMaterial,
  findClassroomMaterials,
  replaceClassroomMaterialFile,
  updateClassroomMaterial,
} from "~/api/classrooms";
import type { ClassroomMaterial, ClassroomMaterialUpdate } from "~/types/ClassroomMaterial";

export function useClassroomMaterials(classroomId: string) {
  const [items, setItems] = useState<ClassroomMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    try {
      const results = await findClassroomMaterials(classroomId);
      if (request === requestId.current) {
        setItems(results);
        setError(null);
      }
    } catch (err) {
      if (request === requestId.current) {
        setError(err instanceof Error ? err.message : "Falha ao listar arquivos.");
      }
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    void refresh();
    return () => { requestId.current += 1; };
  }, [refresh]);

  const perform = useCallback(async (action: () => Promise<unknown>): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      await action();
      await refresh();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na operação.");
      return false;
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }, [refresh]);

  const upload = (title: string, description: string, file: File) =>
    perform(() => createClassroomMaterial(classroomId, title, description, file, setProgress));

  const update = (id: string, data: ClassroomMaterialUpdate) =>
    perform(() => updateClassroomMaterial(classroomId, id, data));

  const replace = (id: string, file: File) =>
    perform(() => replaceClassroomMaterialFile(classroomId, id, file, setProgress));

  const remove = (id: string) =>
    perform(() => deleteClassroomMaterial(classroomId, id));

  return { items, loading, busy, progress, error, refresh, upload, update, replace, remove };
}
