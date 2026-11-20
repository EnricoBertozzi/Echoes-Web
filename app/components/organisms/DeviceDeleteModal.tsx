import type { DeviceInfo } from "~/types/device";
import { ModalButton } from "../atoms/modal/ModalButton";
import { ModalText } from "../atoms/modal/ModalText";
import { ModalTitle } from "../atoms/modal/ModalTitle";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded-2xl bg-white p-8">
        <ModalTitle
          title="Excluir dispositivo"
          description={`Deseja excluir o dispositivo ${device.name || device.hardwareId}?`}
        />

        <ModalText
          text="O dispositivo será removido do sistema e deixará de operar. Essa ação não poderá ser desfeita."
          className="mt-8"
        />

        <div className="mt-12 flex gap-3 justify-end">
          <ModalButton
            label="Cancelar"
            onAction={onClose}
            variant="secondary"
          />

          <ModalButton
            label={busy ? "Excluindo..." : "Excluir"}
            onAction={onConfirm}
            variant="danger"
            disabled={busy}
          />
        </div>
      </div>
    </div>
  );
}
