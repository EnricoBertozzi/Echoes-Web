import { useEffect, useState } from "react";
import { useConfirmation } from "~/context/ConfirmationContext";
import { FiDownload, FiEdit2, FiEye, FiFile, FiPlus, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { Card } from "~/components/atoms/card/Card";
import { ButtonIcon } from "~/components/atoms/ButtonIcon";
import { Alert } from "~/components/atoms/page/Alert";
import { downloadClassroomMaterial } from "~/api/classrooms";
import { ClassroomMaterialModal } from "./ClassroomMaterialModal";
import { useClassroomMaterials } from "~/hooks/classrooms/useClassroomMaterials";
import type { ClassroomMaterial } from "~/types/ClassroomMaterial";

type Mode = "create" | "edit" | "replace";
type Values = { title: string; description: string; file: File | null };

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface ClassroomFilesTabProps {
  classroomId: string;
  isTeacher: boolean;
  archived: boolean;
}

export function ClassroomFilesTab({ classroomId, isTeacher, archived }: ClassroomFilesTabProps) {
  const confirmAction = useConfirmation();
  const { items, loading, busy, progress, error, refresh, upload, update, replace, remove } = useClassroomMaterials(classroomId);
  const [mode, setMode] = useState<Mode | null>(null);
  const [selected, setSelected] = useState<ClassroomMaterial | null>(null);
  const [preview, setPreview] = useState<{ url: string; type: string; name: string } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview.url); };
  }, [preview]);

  function openModal(next: Mode, material: ClassroomMaterial | null = null) {
    setSelected(material);
    setMode(next);
  }

  async function submit(values: Values): Promise<boolean> {
    if (mode === "create") return values.file ? upload(values.title, values.description, values.file) : false;
    if (mode === "edit" && selected) return update(selected.id, { title: values.title, description: values.description });
    if (mode === "replace" && selected && values.file) return replace(selected.id, values.file);
    return false;
  }

  async function openFile(material: ClassroomMaterial, inline: boolean) {
    setDownloading(material.id);
    setFileError(null);
    try {
      const data = await downloadClassroomMaterial(classroomId, material.id, inline);
      const url = URL.createObjectURL(data);
      if (inline) {
        setPreview({ url, type: material.contentType, name: material.originalFileName });
      } else {
        const link = document.createElement("a");
        link.href = url;
        link.download = material.originalFileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
    } catch (caught) {
      setFileError(caught instanceof Error ? caught.message : "Falha ao abrir arquivo.");
    } finally {
      setDownloading(null);
    }
  }

  async function confirmDelete(material: ClassroomMaterial) {
    const confirmed = await confirmAction({
      title: "Excluir material",
      description: `Excluir o material “${material.title}”?`,
      confirmLabel: "Excluir",
      variant: "danger",
    });
    if (!confirmed) return;
    await remove(material.id);
  }

  const canManage = isTeacher && !archived;

  return (
    <Card className="max-lg:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Arquivos da turma</h2>
          <p className="mt-1 text-slate-600">{items.length} {items.length === 1 ? "material disponível" : "materiais disponíveis"}.</p>
          {archived && <p className="text-sm text-amber-700">Turma arquivada: apenas leitura e download.</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void refresh()} disabled={loading} aria-label="Atualizar arquivos"
            className="grid place-items-center rounded-lg border border-slate-300 px-3 py-2 text-slate-700 disabled:opacity-40 max-sm:size-11"><FiRefreshCw /></button>
          {canManage && <button type="button" onClick={() => openModal("create")} disabled={busy}
            className="flex items-center justify-center gap-2 rounded-lg bg-main px-4 py-2 font-semibold text-white disabled:opacity-50 max-sm:min-h-11 max-sm:flex-1"><FiPlus /> Enviar arquivo</button>}
        </div>
      </div>

      {error && <Alert message={error} type="error" />}
      {fileError && <Alert message={fileError} type="error" />}
      {loading && <p className="text-slate-600">Carregando materiais...</p>}
      {!loading && !error && items.length === 0 && <p className="py-8 text-center text-slate-500">Nenhum material foi enviado para esta turma.</p>}
      <ul className="divide-y divide-slate-200">
        {items.map((material) => (
          <li key={material.id} className="flex flex-wrap items-start gap-3 py-5">
            <div className="flex min-w-0 flex-1 gap-3">
              <FiFile size={26} className="mt-1 shrink-0 text-slate-500" aria-hidden="true" />
              <div className="min-w-0 wrap-anywhere">
                <h3 className="text-lg font-bold text-slate-900">{material.title}</h3>
                <p className="break-all text-sm text-slate-600">{material.originalFileName}</p>
                {material.description && <p className="mt-1 whitespace-pre-wrap text-slate-700">{material.description}</p>}
                <p className="mt-1 text-sm text-slate-500">{formatSize(material.fileSize)} · {material.authorName} · {new Date(material.createdAt).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>
            {canManage && (
              <div className="flex shrink-0 gap-1">
                <ButtonIcon
                  label={`Editar material ${material.title}`}
                  onClick={() => openModal("edit", material)}
                  disabled={busy}
                >
                  <FiEdit2 size={22} className="text-slate-900" aria-hidden="true" />
                </ButtonIcon>
                <ButtonIcon
                  label={`Excluir material ${material.title}`}
                  onClick={() => void confirmDelete(material)}
                  disabled={busy}
                >
                  <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
                </ButtonIcon>
              </div>
            )}
            <div className="flex w-full flex-wrap gap-2 text-sm max-sm:[&>button]:min-h-11">
              {material.previewable && <button type="button" onClick={() => void openFile(material, true)} disabled={!!downloading}
                className="flex items-center gap-1 rounded-lg border px-3 py-2 text-slate-700"><FiEye /> Visualizar</button>}
              <button type="button" onClick={() => void openFile(material, false)} disabled={!!downloading}
                className="flex items-center gap-1 rounded-lg border px-3 py-2 text-slate-700"><FiDownload /> Baixar</button>
              {canManage && (
                <button type="button" onClick={() => openModal("replace", material)} disabled={busy}
                  className="flex items-center gap-1 rounded-lg border px-3 py-2 text-slate-700"><FiRefreshCw /> Trocar</button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <ClassroomMaterialModal isOpen={mode !== null} mode={mode ?? "create"} material={selected}
        busy={busy} progress={progress} onSubmit={submit} onClose={() => setMode(null)} />

      {preview && (
        <div role="dialog" aria-modal="true" aria-label={`Visualizar ${preview.name}`}
          className="fixed inset-x-0 top-0 z-50 flex h-dvh flex-col bg-black/80 p-3 sm:p-4">
          <div className="mb-3 flex shrink-0 items-center justify-between gap-3 text-white">
            <p className="truncate font-semibold">{preview.name}</p>
            <button type="button" onClick={() => setPreview(null)} className="shrink-0 rounded bg-white px-4 py-2 text-slate-900 max-sm:min-h-11">Fechar</button>
          </div>
          {preview.type.startsWith("image/") ?
            <img src={preview.url} alt={preview.name} className="min-h-0 w-full flex-1 object-contain" /> :
            <iframe src={preview.url} title={preview.name} sandbox="" className="min-h-0 w-full flex-1 bg-white" />}
        </div>
      )}
    </Card>
  );
}
