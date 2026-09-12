import { Outlet } from "react-router";
import { Sidebar } from "~/components/organisms/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-zinc-200">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
