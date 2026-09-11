import { useEffect, useState } from "react";

import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";

import { AnimalCard } from "~/components/organisms/AnimalCard";
import { AnimalAddModal } from "~/components/organisms/AnimalAddModal";
import { AnimalEditModal } from "~/components/organisms/AnimalEditModal";
import { AnimalDeleteModal } from "~/components/organisms/AnimalDeleteModal";

import {
  createAnimal,
  deleteAnimal,
  findAllAnimals,
  findAnimalsByName,
  updateAnimal,
} from "~/api/animals";

import type {
  Animal,
  AnimalDataRequest,
} from "~/types/Animal";

type ModalState =
  | { type: "create" }
  | { type: "edit"; animal: Animal }
  | { type: "delete"; animal: Animal }
  | null;

export default function Animals() {
  // Lista de animais
  const [animals, setAnimals] = useState<Animal[]>([]);

  // Estado do modal atual
  const [modal, setModal] = useState<ModalState>(null);

  // Estado da barra de busca
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAnimals();
  }, []);

  async function handleSearch(value: string) {
    setSearch(value);

    if (value.trim() === "") {
      await loadAnimals();
      return;
    }

    const data = await findAnimalsByName(
      value,
      0,
      10
    );

    setAnimals(data);
  }

  async function loadAnimals() {
    const data = await findAllAnimals(0, 10);

    setAnimals(data);
  }

  async function handleAnimalAddSubmit(
    data: AnimalDataRequest
  ) {
    await createAnimal(data);

    await loadAnimals();

    setModal(null);
  }

  async function handleAnimalEditSubmit(
    data: AnimalDataRequest
  ) {
    if (modal?.type !== "edit") {
      return;
    }

    await updateAnimal(modal.animal.id, data);

    await loadAnimals();

    setModal(null);
  }

  async function handleDelete() {
    if (modal?.type !== "delete") {
      return;
    }

    await deleteAnimal(modal.animal.id);

    await loadAnimals();

    setModal(null);
  }

  return (
    <main className="flex flex-1">
      <div className="flex flex-col gap-8 px-12 py-16">

        <PageTitle
          title="Animais"
          description="Modelos de animais representados pelos simuladores."
        />

        <div className="w-36">
          <Button
            label="Novo Animal"
            onClick={() => setModal({ type: "create" })}
          />
        </div>

        <SearchBar
          value={search}
          onChange={handleSearch}
        />

        <div className="overflow-y-scroll">
          <ul className="flex flex-wrap gap-8">
            {animals.map((animal) => (
              <li key={animal.id}>
                <AnimalCard
                  name={animal.name}
                  model={animal.model}
                  description={animal.description}
                  onEdit={() => setModal({
                      type: "edit",
                      animal,
                    })
                  }
                  onDelete={() => setModal({
                      type: "delete",
                      animal,
                    })
                  }
                  onOpen={() => console.log("abrir")}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal de criação */}
      {modal?.type === "create" && (
        <AnimalAddModal
          onClose={() => setModal(null)}
          onSubmit={handleAnimalAddSubmit}
        />
      )}

      {/* Modal de edição */}
      {modal?.type === "edit" && (
        <AnimalEditModal
          animal={modal.animal}
          onClose={() => setModal(null)}
          onSubmit={handleAnimalEditSubmit}
        />
      )}

      {/* Modal de exclusão */}
      {modal?.type === "delete" && (
        <AnimalDeleteModal
          animal={modal.animal}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
    </main>
  );
}