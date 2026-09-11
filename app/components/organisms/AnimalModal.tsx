import { useState } from "react";

import type { Animal, AnimalDataRequest } from "~/types/Animal";

interface AnimalModalProps {
  animal?: Animal;
  onClose: () => void;
  onSubmit: (data: AnimalDataRequest) => void;
}

export function AnimalModal({ animal, onClose, onSubmit }: AnimalModalProps) {
  const [name, setName] = useState(animal?.name ?? "");
  const [model, setModel] = useState(animal?.model ?? "");
  const [description, setDescription] = useState(animal?.description ?? "");

  const isEditing = animal !== undefined;

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
      <div className="w-150 rounded-2xl bg-white p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Editar Animal" : "Novo Animal"}
          </h2>

        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="animal-name" className="text-slate-900">
              Nome
            </label>

            <input
              id="animal-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="rounded-lg border border-slate-300 p-3 text-slate-900 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="animal-model" className="text-slate-900">
              Modelo
            </label>

            <input
              id="animal-model"
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="rounded-lg border border-slate-300 p-3 text-slate-900 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="animal-description" className="text-slate-900">
              Descrição
            </label>

            <textarea
              id="animal-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 resize-none rounded-lg border border-slate-300 p-3 text-slate-900 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-slate-300 py-3 text-slate-900 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 cursor-pointer rounded-lg bg-main py-3 text-white hover:opacity-90"
            >
              {isEditing ? "Salvar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
