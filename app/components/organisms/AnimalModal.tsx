import { useState } from "react";
import type { AnimalRegisterRequest } from "~/types/Animal";

interface AnimalModalProps {
  onClose: () => void;
  onSubmit: (data: AnimalRegisterRequest) => void;
}
export function AnimalModal({ onClose, onSubmit }: AnimalModalProps) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onSubmit({
      name,
      model,
      description,
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-140 rounded-2xl bg-white p-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Novo Animal</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-slate-900">
              Nome
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border p-3 text-slate-900"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="model" className="text-slate-900">
              Modelo
            </label>

            <input
              id="model"
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="rounded-lg border p-3 text-slate-900"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-slate-900">
              Descrição
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 resize-none rounded-lg border p-3 text-slate-900"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-6 py-3 text-slate-900"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-main px-6 py-3 text-white"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
