import { OrbitProgress } from "react-loading-indicators";

export function LoadingPage() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-zinc-200 px-4">
      <OrbitProgress color="#62748e" size="medium" text="" textColor="" />
    </main>
  );
}
