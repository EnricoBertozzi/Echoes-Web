import type { Animal } from "~/types/Animal";

interface AnimalDeleteModalProps {
  animal: Animal;
  onClose: () => void;
  onConfirm: () => void;
}

export function AnimalDeleteModal({
  animal,
  onClose,
  onConfirm,
}: AnimalDeleteModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-125 rounded-2xl bg-white p-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Remover Animal</h2>

          <p className="text-lg text-slate-600">
            Deseja realmente remover o animal{" "}
            <strong className="text-slate-900">{animal.name}</strong>?
          </p>

          <p className="text-sm text-slate-500">
            Essa ação não poderá ser desfeita.
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 cursor-pointer rounded-lg border border-slate-300 py-3 text-slate-900 hover:bg-slate-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 cursor-pointer rounded-lg bg-red-600 py-3 text-white hover:bg-red-700"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
