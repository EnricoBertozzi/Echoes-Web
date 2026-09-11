import { useEffect, useState } from "react";

import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { AnimalCard } from "~/components/organisms/AnimalCard";
import { AnimalModal } from "~/components/organisms/AnimalModal";

import { createAnimal, findAllAnimals, updateAnimal } from "~/api/animals";

import type { Animal, AnimalDataRequest } from "~/types/Animal";

export default function Animals() {
  // Define a lista de animais da página
  const [animals, setAnimals] = useState<Animal[]>([]);
  
  // Abre o model de cadastro / edição
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mostra o animal selecionado para edição
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | undefined>();

  // Carrega os animais uma vez
  useEffect(() => {
    loadAnimals();
  }, []);

  // Método de listagem de animais
  async function loadAnimals() {
    const data = await findAllAnimals(0, 10);

    setAnimals(data);
  }


  async function handleAnimalSubmit(data: AnimalDataRequest) {
    if (selectedAnimal) {
      await updateAnimal(selectedAnimal.id, data);
    } else {
      await createAnimal(data);
    }

    // Atualiza a lista de animais após edição, cadastro
    const updatedAnimals = await findAllAnimals(0, 10);

    setAnimals(updatedAnimals);

    setIsModalOpen(false);
    setSelectedAnimal(undefined);
  }

  function handleEditAnimal(animal: Animal) {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
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
                  onEdit={() => handleEditAnimal(animal)}
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
          animal={selectedAnimal}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAnimalSubmit}
        />
      )}
    </main>
  );
}
