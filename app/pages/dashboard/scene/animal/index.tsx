import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { findAnimalById } from "~/api/animals";
import {
  createPoint,
  deletePoint,
  findAllPointsByAnimalId,
  updatePoint,
} from "~/api/points";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { PointAddModal } from "~/components/organisms/PointAddModal";
import { PointCard } from "~/components/organisms/PointCard";
import { PointDeleteModal } from "~/components/organisms/PointDeleteModal";
import { PointEditModal } from "~/components/organisms/PointEditModal";
import type { Animal } from "~/types/Animal";
import type {
  AuscultationPoint,
  AuscultationPointRegisterRequest,
  AuscultationPointUpdateRequest,
} from "~/types/AuscultationPoint";

type PointModalState =
  | { type: "create" }
  | { type: "edit"; point: AuscultationPoint }
  | { type: "delete"; point: AuscultationPoint }
  | null;

export default function AnimalScene() {
  const navigate = useNavigate();
  const { animalId } = useParams();

  // States
  const [pointModal, setPointModal] = useState<PointModalState>(null);

  // Armazena os dados do animal
  const [animal, setAnimal] = useState<Animal>();

  // Armazena os pontos de escuta do modelo
  const [points, setPoints] = useState<AuscultationPoint[]>([]);

  useEffect(() => {
    loadAnimal();
    loadPoints();
  }, []);

  async function loadPoints() {
    const points = await findAllPointsByAnimalId(0, 10, animalId);

    setPoints(points);
  }

  async function loadAnimal() {
    const animal = await findAnimalById(animalId);

    setAnimal(animal);
  }

  async function handlePointAddSubmit(data: AuscultationPointRegisterRequest) {
    await createPoint(data);

    await loadPoints();

    setPointModal(null);
  }

  async function handlePointEditSubmit(data: AuscultationPointUpdateRequest) {
    if (pointModal?.type !== "edit") {
      return;
    }

    await updatePoint(pointModal.point.id, data);

    await loadPoints();

    setPointModal(null);
  }

  async function handlePointDeleteSubmit() {
    if (pointModal?.type !== "delete") {
      return;
    }

    await deletePoint(pointModal.point.id);

    await loadPoints();

    setPointModal(null);
  }

  return (
    <main className="flex flex-1 bg-zinc-100">
      <div className="h-full w-full flex flex-col gap-8 px-12 py-16">
        <div className="w-36">
          <button onClick={() => navigate("/dashboard/scene")} className="text-slate-500 text-left text-xl hover:underline cursor-pointer">
            Voltar
          </button>
        </div>
        <PageTitle
          title={`${animal?.name}`}
          description={`${animal?.description}`}
        />

        <div className="w-36">
          <Button
            label="Novo Ponto"
            onClick={() => setPointModal({ type: "create" })}
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-scroll">
          <ul className="flex flex-col gap-8 w-full">
            {points.map((point) => (
              <li key={point.id}>
                <PointCard
                  position={point.position}
                  onPointEdit={() => setPointModal({ type: "edit", point })}
                  onPointDelete={() => setPointModal({ type: "delete", point })}
                  onScenarioAdd={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  onScenarioDelete={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  onScenarioEdit={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {pointModal?.type === "create" && (
        <PointAddModal
          animal={animal}
          onClose={() => setPointModal(null)}
          onSubmit={handlePointAddSubmit}
        />
      )}

      {pointModal?.type === "edit" && (
        <PointEditModal
          point={pointModal.point}
          onClose={() => setPointModal(null)}
          onSubmit={handlePointEditSubmit}
        />
      )}
      {pointModal?.type === "delete" && (
        <PointDeleteModal
          point={pointModal.point}
          onClose={() => setPointModal(null)}
          onConfirm={handlePointDeleteSubmit}
        />
      )}
    </main>
  );
}
