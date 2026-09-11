import { useEffect, useState } from "react";

import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";

import { AnimalCard } from "~/components/organisms/AnimalCard";
import { AnimalModal } from "~/components/organisms/AnimalModal";
import { AnimalDeleteModal } from "~/components/organisms/AnimalDeleteModal";

import {
  createAnimal,
  deleteAnimal,
  findAllAnimals,
  updateAnimal,
} from "~/api/animals";

import type { Animal, AnimalDataRequest } from "~/types/Animal";

export default function Animals() {
  // Lista de animais
  const [animals, setAnimals] = useState<Animal[]>([]);

  // Controle do modal de cadastro/edição
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animal selecionado para edição
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | undefined>();

  // Controle do modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Animal selecionado para exclusão
  const [animalToDelete, setAnimalToDelete] = useState<Animal | undefined>();

  useEffect(() => {
    loadAnimals();
  }, []);

  async function loadAnimals() {
    const data = await findAllAnimals(0, 10);

    setAnimals(data);
  }

  function handleNewAnimal() {
    setSelectedAnimal(undefined);
    setIsModalOpen(true);
  }

  function handleEditAnimal(animal: Animal) {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  }

  async function handleAnimalSubmit(data: AnimalDataRequest) {
    if (selectedAnimal) {
      await updateAnimal(selectedAnimal.id, data);
    } else {
      await createAnimal(data);
    }

    const updatedAnimals = await findAllAnimals(0, 10);

    setAnimals(updatedAnimals);

    setIsModalOpen(false);
    setSelectedAnimal(undefined);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedAnimal(undefined);
  }

  function handleDeleteAnimal(animal: Animal) {
    setAnimalToDelete(animal);
    setIsDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (!animalToDelete) {
      return;
    }

    await deleteAnimal(animalToDelete.id);

    const updatedAnimals = await findAllAnimals(0, 10);

    setAnimals(updatedAnimals);

    setIsDeleteModalOpen(false);
    setAnimalToDelete(undefined);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setAnimalToDelete(undefined);
  }

  return (
    <main className="flex flex-1">
      <div className="flex flex-col gap-8 px-12 py-16">
        <PageTitle
          title="Animais"
          description="Modelos de animais representados pelos simuladores."
        />

        <div className="w-36">
          <Button label="Novo Animal" onClick={handleNewAnimal} />
        </div>

        <SearchBar
          value=""
          onChange={(value: string) => {
            console.log(value);
          }}
        />

        <div className="overflow-y-scroll">
          <ul className="flex flex-wrap gap-8">
            {animals.map((animal) => (
              <li key={animal.id}>
                <AnimalCard
                  name={animal.name}
                  model={animal.model}
                  description={animal.description}
                  onEdit={() => handleEditAnimal(animal)}
                  onDelete={() => handleDeleteAnimal(animal)}
                  onOpen={() => console.log("abrir")}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <AnimalModal
          animal={selectedAnimal}
          onClose={handleCloseModal}
          onSubmit={handleAnimalSubmit}
        />
      )}

      {isDeleteModalOpen && animalToDelete && (
        <AnimalDeleteModal
          animal={animalToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </main>
  );
}
