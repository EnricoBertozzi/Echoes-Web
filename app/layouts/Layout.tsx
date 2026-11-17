import { Outlet } from "react-router";
import ProtectedLayout from "~/layouts/ProtectedLayout";
import { Sidebar } from "~/components/organisms/Sidebar";
import { TermsGate } from "~/components/organisms/terms/TermsGate";

export default function DashboardLayout() {
  return (
    <ProtectedLayout>
      <TermsGate>
        <div className="flex w-full h-full bg-zinc-200">
          <Sidebar />

          <main className="flex flex-1">
            <Outlet />
          </main>
        </div>
      </TermsGate>
    </ProtectedLayout>
  );
}
