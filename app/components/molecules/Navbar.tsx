import { FiUser } from "react-icons/fi";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-300 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-zinc-800">{title}</h1>
      <div className="flex items-center gap-2 text-zinc-500">
        <FiUser className="text-xl" />
        <span className="text-sm">Administrador</span>
      </div>
    </header>
  );
}
