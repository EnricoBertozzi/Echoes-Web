import { useEffect, useState } from "react";

import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { AnimalCard } from "~/components/organisms/AnimalCard";
import { AnimalModal } from "~/components/organisms/AnimalModal";

import { createAnimal, findAllAnimals } from "~/api/animals";

import type { Animal, AnimalRegisterRequest } from "~/types/Animal";

export default function Animals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAnimals();
  }, []);

  async function loadAnimals() {
    const data = await findAllAnimals(0, 10);

    setAnimals(data);
  }

  async function handleCreateAnimal(data: AnimalRegisterRequest) {
    await createAnimal(data);

    const updatedAnimals = await findAllAnimals(0, 10);

    setAnimals(updatedAnimals);

    setIsModalOpen(false);
  }

  return (
    <main className="flex flex-1">
      <div className="flex flex-col gap-8 px-12 py-16">
        <PageTitle
          title="Animais"
          description="Modelos de animais representados pelos simuladores."
        />

        <div className="w-36">
          <Button label="Novo Animal" onClick={() => setIsModalOpen(true)} />
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
                  onEdit={() => console.log("editar")}
                  onDelete={() => console.log("deletar")}
                  onOpen={() => console.log("abrir")}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <AnimalModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAnimal}
        />
      )}
    </main>
  );
}
