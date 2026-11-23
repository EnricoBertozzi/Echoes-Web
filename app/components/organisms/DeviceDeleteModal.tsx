import type { DeviceInfo } from "~/types/device";
import { ModalText } from "../atoms/modal/ModalText";
import { DeleteConfirmationModal } from "./modal/DeleteConfirmationModal";

interface DeviceDeleteModalProps {
  device: DeviceInfo;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeviceDeleteModal({
  device,
  busy,
  onClose,
  onConfirm,
}: DeviceDeleteModalProps) {
  return (
    <DeleteConfirmationModal
      title="Excluir dispositivo"
      description={`Deseja excluir o dispositivo ${device.name || device.hardwareId}?`}
      confirmLabel={busy ? "Excluindo..." : "Excluir"}
      confirmDisabled={busy}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ModalText text="O dispositivo será removido do sistema e deixará de operar. Essa ação não poderá ser desfeita." />
    </DeleteConfirmationModal>
  );
}
