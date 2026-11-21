import { Outlet } from "react-router";
import ProtectedLayout from "~/layouts/ProtectedLayout";
import { Sidebar } from "~/components/organisms/Sidebar";
import { TermsGate } from "~/components/organisms/terms/TermsGate";

export default function DashboardLayout() {
  return (
    <ProtectedLayout>
      <TermsGate>
        <div className="flex h-dvh w-full flex-col bg-zinc-200 lg:h-full lg:flex-row">
          <Sidebar />

          <div className="flex min-h-0 min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </TermsGate>
    </ProtectedLayout>
  );
}
