import { useEffect, useState } from "react";
import { findAllAnimals } from "~/api/animals";
import type { Animal } from "~/types/Animal";

export function useAnimalOptions(enabled: boolean) {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    findAllAnimals(0, 200)
      .then((result) => {
        if (active) setAnimals(result);
      })
      .catch(() => {
        // o interceptor do axios já mostrou o erro
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return animals;
}
