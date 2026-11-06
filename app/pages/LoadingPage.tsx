import { OrbitProgress } from "react-loading-indicators";
import { Main } from "../components/atoms/page/Main";

export function LoadingPage() {
  return (
    <main className="h-full w-full bg-zinc-200 flex justify-center align-middle">
      <OrbitProgress color="#62748e" size="medium" text="" textColor="" />
    </main>
  );
}
