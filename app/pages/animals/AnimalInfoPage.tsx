import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { findAnimalById } from "~/api/animals";

import {
  createPoint,
  deletePoint,
  findAllPointsByAnimalId,
  updatePoint,
} from "~/api/points";

import {
  createScenario,
  deleteScenario,
  findScenariosByPointId,
  updateScenario,
} from "~/api/scenario";

import { Button } from "~/components/atoms/Button";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";

import { PointAddModal } from "~/components/organisms/PointAddModal";
import { PointCard } from "~/components/organisms/PointCard";
import { PointDeleteModal } from "~/components/organisms/PointDeleteModal";
import { PointEditModal } from "~/components/organisms/PointEditModal";

import { ScenarioAddModal } from "~/components/organisms/ScenarioAddModal";
import { ScenarioDeleteModal } from "~/components/organisms/ScenarioDeleteModal";
import { ScenarioEditModal } from "~/components/organisms/ScenarioEditModal";

import type { Animal } from "~/types/Animal";

import type {
  AuscultationPoint,
  AuscultationPointRegisterRequest,
  AuscultationPointUpdateRequest,
} from "~/types/AuscultationPoint";

import type {
  Scenario,
  ScenarioRegisterRequest,
  ScenarioUpdateRequest,
} from "~/types/Scenario";

type PointModalState =
  | { type: "create" }
  | { type: "edit"; point: AuscultationPoint }
  | { type: "delete"; point: AuscultationPoint }
  | null;

type ScenarioModalState =
  | {
      type: "create";
      pointId: string;
    }
  | {
      type: "edit";
      scenario: Scenario;
      pointId: string;
    }
  | {
      type: "delete";
      scenario: Scenario;
      pointId: string;
    }
  | null;

export default function AnimalInfoPage() {
  const navigate = useNavigate();
  const { animalId } = useParams();

  const [pointModal, setPointModal] = useState<PointModalState>(null);

  const [scenarioModal, setScenarioModal] = useState<ScenarioModalState>(null);

  const [animal, setAnimal] = useState<Animal>();

  const [points, setPoints] = useState<AuscultationPoint[]>([]);

  const [scenarios, setScenarios] = useState<Record<string, Scenario[]>>({});

  useEffect(() => {
    if (!animalId) {
      return;
    }

    loadAnimal();
    loadPoints();
  }, [animalId]);

  async function loadAnimal() {
    if (!animalId) {
      return;
    }

    const animal = await findAnimalById(animalId);

    setAnimal(animal);
  }

  async function loadPoints() {
    if (!animalId) {
      return;
    }

    const points = await findAllPointsByAnimalId(0, 10, animalId);

    setPoints(points);

    await Promise.all(points.map((point) => loadScenarios(point.id)));
  }

  async function handlePointAddSubmit(data: AuscultationPointRegisterRequest) {
    await createPoint(data);

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

  async function loadScenarios(pointId: string) {
    const scenarios = await findScenariosByPointId(pointId, 0, 10);

    setScenarios((current) => ({
      ...current,
      [pointId]: scenarios,
    }));
  }

  async function handleScenarioEditSubmit(data: ScenarioUpdateRequest) {
    if (scenarioModal?.type !== "edit") {
      return;
    }

    await updateScenario(scenarioModal.scenario.id, data);

    await loadScenarios(scenarioModal.pointId);

    setScenarioModal(null);
  }

  async function handleScenarioDeleteSubmit() {
    if (scenarioModal?.type !== "delete") {
      return;
    }

    await deleteScenario(scenarioModal.scenario.id);

    await loadScenarios(scenarioModal.pointId);

    setScenarioModal(null);
  }

  return (
    <Main>
        <PageTitle
          title={`${animal?.name}`}
          description={`${animal?.description}`}
          backPath="/animals"
        />

        <div className="w-36">
          <Button
            onClick={() => setPointModal({type: "create"})}
            label="Novo Ponto"
            variant="primary"
          />
        </div>

        <div className="min-h-0 flex-1">
          <ul className="flex w-full flex-col gap-8">
            {points.map((point) => (
              <li key={point.id} className="w-full">
                <PointCard
                  position={point.position}
                  scenarios={scenarios[point.id] ?? []}
                  onPointEdit={() =>
                    setPointModal({
                      type: "edit",
                      point,
                    })
                  }
                  onPointDelete={() =>
                    setPointModal({
                      type: "delete",
                      point,
                    })
                  }
                  onScenarioAdd={() =>
                    setScenarioModal({
                      type: "create",
                      pointId: point.id,
                    })
                  }
                  onScenarioEdit={(scenario) =>
                    setScenarioModal({
                      type: "edit",
                      scenario,
                      pointId: point.id,
                    })
                  }
                  onScenarioDelete={(scenario) =>
                    setScenarioModal({
                      type: "delete",
                      scenario,
                      pointId: point.id,
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </div>

      {pointModal?.type === "create" && (
        <PointAddModal
          isOpen={pointModal?.type === "create"}
          animal={animal}
          onClose={() => setPointModal(null)}
        />
      )}

      {pointModal?.type === "edit" && (
        <PointEditModal
          isOpen={pointModal?.type === "edit"}
          point={pointModal.point}
          onClose={() => setPointModal(null)}
        />
      )}

      {pointModal?.type === "delete" && (
        <PointDeleteModal
          isOpen={pointModal?.type === "delete"}
          onConfirm={handlePointDeleteSubmit}
          point={pointModal.point}
          onClose={() => setPointModal(null)}
        />
      )}

      {scenarioModal?.type === "create" && (
        <ScenarioAddModal
          isOpen={scenarioModal?.type === "create"}
          pointId={scenarioModal.pointId}
          onClose={() => setScenarioModal(null)}
        />
      )}

      {scenarioModal?.type === "edit" && (
        <ScenarioEditModal
          isOpen={scenarioModal?.type === "edit"}
          scenario={scenarioModal.scenario}
          onClose={() => setScenarioModal(null)}
          onSubmit={handleScenarioEditSubmit}
        />
      )}

      {scenarioModal?.type === "delete" && (
        <ScenarioDeleteModal
          isOpen={scenarioModal?.type === "delete"}
          scenario={scenarioModal.scenario}
          onClose={() => setScenarioModal(null)}
          onConfirm={handleScenarioDeleteSubmit}
        />
      )}
    </Main>
  );
}
