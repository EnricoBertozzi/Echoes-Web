import { FiEdit, FiTrash2 } from "react-icons/fi";
import { Button } from "../atoms/Button";
import { ButtonIcon } from "../atoms/ButtonIcon";
import { SelectInput } from "../atoms/input/SelectInput";
import { ModalTextField } from "../atoms/modal/ModalTextField";
import { FaDog } from "react-icons/fa";
import type {
  DeviceInfo,
  DeviceStatus,
  DeviceUpdateRequest,
} from "~/types/device";
import { useState } from "react";
import { Link, useActionData } from "react-router";
import { useAuth } from "~/context/AuthContext";
import type { ClassroomLabel } from "~/types/Classroom";
import { deviceStatusLabels, deviceStatusTextStyles } from "~/utils/deviceUi";
import { DeviceDeleteModal } from "./DeviceDeleteModal";

interface DeviceCardProps {
  device: DeviceInfo;
  classroomLabels: Map<string, ClassroomLabel>;
  institutionOptions: Map<string, string | number>;
  approvalInstitutionOptions: Map<string, string | number>;
  animalOptions: Map<string, string | number>;
  busy: boolean;
  onApprove: (deviceId: string, institutionId: string) => void;
  onToggle: (device: DeviceInfo) => void;
  onUpdate: (deviceId: string, data: DeviceUpdateRequest) => Promise<boolean>;
  onDelete: (device: DeviceInfo) => Promise<boolean>;
}

export function DeviceCard({
  device,
  classroomLabels,
  institutionOptions,
  approvalInstitutionOptions,
  animalOptions,
  busy,
  onApprove,
  onToggle,
  onUpdate,
  onDelete,
}: DeviceCardProps) {
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [approvalInstitutionId, setApprovalInstitutionId] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [name, setName] = useState(device.name ?? "");
  const [animalId, setAnimalId] = useState(device.animalId ?? "");

  const trimmedName = name.trim();
  const nameChanged = trimmedName !== (device.name ?? "");
  const nameError = nameChanged && trimmedName === "";

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";
  const classroomLabel = device.classroomId
    ? classroomLabels.get(device.classroomId)
    : undefined;

  function startEditing() {
    setName(device.name ?? "");
    setInstitutionId(device.institutionId ?? "");
    setAnimalId(device.animalId ?? "");
    setEditing(true);
  }

  async function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nameError) return;

    const data: DeviceUpdateRequest = {};

    if (nameChanged) data.name = trimmedName;

    if (
      device.status !== "PENDING" &&
      institutionId !== "" &&
      institutionId !== (device.institutionId ?? "")
    ) {
      data.institutionId = institutionId;
    }

    if (animalId !== "" && animalId !== (device.animalId ?? "")) {
      data.animalId = animalId;
    }

    if (Object.keys(data).length === 0) {
      setEditing(false);
      return;
    }

    const updated = await onUpdate(device.id, data);
    if (updated) setEditing(false);
  }

  async function handleDelete() {
    if (deleting) return;

    setDeleting(true);
    const removed = await onDelete(device);
    setDeleting(false);

    if (removed) setShowDeleteModal(false);
  }

  return (
    <article className="flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-main">
          <FaDog size={28} className="text-white" />
        </div>

        {isAdmin && !editing && (
          <div className="flex shrink-0 gap-1">
            <ButtonIcon label="Editar dispositivo" onClick={startEditing} disabled={busy}>
              <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
            </ButtonIcon>
            <ButtonIcon
              label={deleting ? "Excluindo dispositivo" : "Excluir dispositivo"}
              onClick={() => setShowDeleteModal(true)}
              disabled={busy || deleting}
            >
              <FiTrash2 size={22} className="text-red-900" aria-hidden="true" />
            </ButtonIcon>
          </div>
        )}
      </div>

      {isAdmin && editing ? (
        <form className="flex flex-col gap-4" onSubmit={handleEditSubmit}>
          <div className="flex flex-col gap-2">
            <ModalTextField
              id={`device-name-${device.id}`}
              label="Nome"
              value={name}
              onChange={setName}
            />
            {nameError && (
              <span className="text-sm text-red-500">
                O nome não pode ficar vazio.
              </span>
            )}
          </div>

          {device.status !== "PENDING" ? (
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`device-institution-${device.id}`}
                className="text-slate-900"
              >
                Instituição
              </label>
              <SelectInput
                id={`device-institution-${device.id}`}
                name={`device-institution-${device.id}`}
                placeholder="Escolha a instituição"
                options={institutionOptions}
                value={institutionId}
                onChange={(event) => setInstitutionId(event.target.value)}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              A instituição é definida no momento da aprovação.
            </p>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor={`device-animal-${device.id}`}
              className="text-slate-900"
            >
              Animal
            </label>
            <SelectInput
              id={`device-animal-${device.id}`}
              name={`device-animal-${device.id}`}
              placeholder={
                device.animalId ? "Selecione outro animal" : "Sem animal"
              }
              options={animalOptions}
              value={animalId}
              onChange={(event) => setAnimalId(event.target.value)}
              disablePlaceholder={Boolean(device.animalId)}
            />
            {device.animalId && (
              <span className="text-sm text-slate-500">
                O animal associado não pode ser removido.
              </span>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy}
              className="min-w-0 flex-1 cursor-pointer rounded bg-stone-300 px-4 py-3 text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={busy || nameError}
              className="min-w-0 flex-1 cursor-pointer rounded bg-main px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex min-w-0 flex-col gap-1">
            <h2
              className="line-clamp-2 text-xl font-bold text-slate-900"
              title={device.name}
            >
              {device.name || "—"}
            </h2>
            <p
              className="truncate font-mono text-sm text-slate-500"
              title={device.hardwareId}
            >
              {device.hardwareId}
            </p>
            <span className="text-lg text-slate-500">
              Status:{" "}
              <span className={deviceStatusTextStyles[device.status]}>
                {deviceStatusLabels[device.status]}
              </span>
            </span>
          </div>

          {device.status === "ACTIVE" &&
            (!device.classroomId || classroomLabel?.archived) && (
              <p className="text-sm text-amber-700">
                {!device.classroomId
                  ? "Não toca áudio: sem turma."
                  : "Não toca áudio: turma arquivada."}
              </p>
            )}

          {(device.institutionName ||
            device.animalName ||
            device.status !== "PENDING") && (
            <dl className="flex flex-col gap-1 text-sm text-slate-600">
              {device.institutionName && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="shrink-0 font-medium text-slate-700">
                    Instituição
                  </dt>
                  <dd
                    className="truncate text-right"
                    title={device.institutionName}
                  >
                    {device.institutionName}
                  </dd>
                </div>
              )}

              {device.animalName && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="shrink-0 font-medium text-slate-700">
                    Animal
                  </dt>
                  <dd className="truncate" title={device.animalName}>
                    {device.animalName}
                  </dd>
                </div>
              )}

              {device.status !== "PENDING" && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="shrink-0 font-medium text-slate-700">
                    Turma
                  </dt>
                  <dd
                    className="truncate text-right"
                    title={
                      classroomLabel
                        ? `${classroomLabel.title} • ${classroomLabel.period}${classroomLabel.archived ? " (arquivada)" : ""}`
                        : undefined
                    }
                  >
                    {!device.classroomId ? (
                      "Sem turma"
                    ) : classroomLabel ? (
                      <Link
                        to={`/institutions/${device.institutionId}/classrooms/${device.classroomId}`}
                        className="text-main underline-offset-2 hover:underline"
                      >
                        {classroomLabel.title} • {classroomLabel.period}
                        {classroomLabel.archived ? " (arquivada)" : ""}
                      </Link>
                    ) : (
                      "Turma vinculada"
                    )}
                  </dd>
                </div>
              )}
            </dl>
          )}

          {(isAdmin || (isManager && device.status !== "PENDING")) &&
            !editing && (
              <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4">
                {device.status !== "PENDING" && (
                  <Link
                    to={`/devices/${device.id}/scenarios`}
                    className="flex w-full cursor-pointer items-center justify-center rounded bg-gray-300 py-3 text-black"
                  >
                    Cenários
                  </Link>
                )}

                {isAdmin && device.status === "PENDING" && (
                  <>
                    <SelectInput
                      id={`institution-${device.id}`}
                      name={`institution-${device.id}`}
                      placeholder="Escolha a instituição"
                      options={approvalInstitutionOptions}
                      value={approvalInstitutionId}
                      onChange={(event) =>
                        setApprovalInstitutionId(event.target.value)
                      }
                    />
                    <Button
                      type="button"
                      label={busy ? "Aprovando..." : "Aprovar"}
                      disabled={!approvalInstitutionId || busy}
                      onClick={() => onApprove(device.id, approvalInstitutionId)}
                    />
                  </>
                )}

                {isAdmin && device.status !== "PENDING" && (
                  <Button
                    type="button"
                    label={
                      device.status === "ACTIVE"
                        ? busy
                          ? "Desativando..."
                          : "Desativar"
                        : busy
                          ? "Ativando..."
                          : "Ativar"
                    }
                    disabled={busy}
                    onClick={() => onToggle(device)}
                  />
                )}
              </div>
            )}

          {isAdmin && showDeleteModal && (
            <DeviceDeleteModal
              device={device}
              busy={deleting}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={() => void handleDelete()}
            />
          )}
        </>
      )}
    </article>
  );
}
