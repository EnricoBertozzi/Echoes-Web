import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useLocation } from "react-router";
import Icon from "~/assets/icon.svg?react";
import { useLogout } from "~/hooks/auth/useLogout";
import { useSidebar } from "~/hooks/useSidebar";
import { Button } from "../atoms/Button";
import { LogoutSidebar } from "../atoms/SidebarLogout";
import { SidebarProfile } from "../atoms/SidebarProfile";
import { ModalForm } from "../atoms/modal/ModalForm";
import { ModalTitle } from "../atoms/modal/ModalTitle";
import { Navbar } from "../molecules/Navbar";

interface SidebarContentProps {
  collapsed: boolean;
  onLogout: () => void;
}

function SidebarContent({ collapsed, onLogout }: SidebarContentProps) {
  return (
    <>
      <nav className="w-full" aria-label="Navegação principal">
        <Navbar collapsed={collapsed} />
      </nav>

      <div className="mt-auto flex w-full flex-col gap-2">
        <div
          className={clsx(
            "w-full transition-[padding] duration-500",
            collapsed ? "px-2" : "pl-10 pr-4",
          )}
        >
          <SidebarProfile collapsed={collapsed} />
        </div>

        <LogoutSidebar collapsed={collapsed} onClick={onLogout} />
      </div>
    </>
  );
}

export function Sidebar() {
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapse";
  const { key: locationKey } = useLocation();
  const { onLogout } = useLogout();
  const mobileMenu = useRef<HTMLDialogElement>(null);
  const logoutDialog = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    mobileMenu.current?.close();
    logoutDialog.current?.close();
  }, [locationKey]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");

    function closeMenuOnDesktop(event: MediaQueryListEvent) {
      if (event.matches) mobileMenu.current?.close();
    }

    desktop.addEventListener("change", closeMenuOnDesktop);
    return () => desktop.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  function openMenu() {
    mobileMenu.current?.showModal();
    setMenuOpen(true);
  }

  function openLogout() {
    logoutDialog.current?.showModal();
  }

  return (
    <>
      <header className="flex shrink-0 items-center gap-3 bg-main px-4 py-2 text-white lg:hidden">
        <button
          type="button"
          aria-label="Abrir menu"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          onClick={openMenu}
          className="grid size-11 cursor-pointer place-items-center rounded-lg hover:bg-white/10"
        >
          <FiMenu size={24} aria-hidden="true" />
        </button>
        <span className="font-semibold">Echoes</span>
      </header>

      <dialog
        id="mobile-navigation"
        ref={mobileMenu}
        aria-label="Menu de navegação"
        onClose={(event) => setMenuOpen(event.currentTarget.open)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="fixed inset-y-0 right-auto left-0 m-0 h-dvh max-h-none w-full max-w-xs overflow-x-hidden overflow-y-auto overscroll-contain bg-main backdrop:bg-black/50 lg:hidden"
      >
        <div className="flex min-h-full flex-col gap-4 py-4">
          <header className="flex items-center justify-between gap-4 px-4 text-white">
            <span className="font-semibold">Menu</span>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => mobileMenu.current?.close()}
              className="grid size-11 cursor-pointer place-items-center rounded-lg hover:bg-white/10"
            >
              <FiX size={24} aria-hidden="true" />
            </button>
          </header>

          <SidebarContent collapsed={false} onLogout={openLogout} />
        </div>
      </dialog>

      <aside
        className={clsx(
          "hidden h-full shrink-0 flex-col items-center gap-8 overflow-x-hidden overflow-y-auto bg-main py-6 transition-all duration-500 lg:flex",
          collapsed ? "w-16" : "w-[22%]",
        )}
      >
        <header
          className={clsx(
            "flex w-full items-center",
            collapsed ? "justify-center" : "justify-end px-8",
          )}
        >
          <button
            type="button"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
            className="cursor-pointer text-white"
            onClick={sidebar.toggleState}
          >
            {collapsed ? (
              <FiMenu size={24} aria-hidden="true" />
            ) : (
              <FaArrowLeft size={24} aria-hidden="true" />
            )}
          </button>
        </header>

        <div className="flex h-1/4 w-full items-center justify-center">
          <div
            className={clsx(
              "aspect-square w-1/2 rounded-full bg-zinc-200 transition-[padding] duration-500",
              collapsed ? "p-1" : "p-10 max-xl:p-8",
            )}
          >
            <Icon className="h-full w-full fill-main" />
          </div>
        </div>

        <SidebarContent collapsed={collapsed} onLogout={openLogout} />
      </aside>

      <dialog
        ref={logoutDialog}
        aria-label="Logout"
        className="m-auto max-h-[calc(100dvh_-_2rem)] w-150 max-w-[calc(100%_-_2rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-8 pt-12 backdrop:bg-black/50"
      >
        <button
          type="button"
          aria-label="Fechar confirmação"
          className="absolute top-6 right-6 cursor-pointer text-gray-500 hover:text-black"
          onClick={() => logoutDialog.current?.close()}
        >
          <FiX size={24} aria-hidden="true" />
        </button>
        <ModalTitle title="Logout" description="Deseja sair da plataforma?" />
        <ModalForm onSubmit={onLogout}>
          <div className="mt-3 flex justify-end gap-3">
            <Button
              type="button"
              label="Cancelar"
              variant="muted"
              onClick={() => logoutDialog.current?.close()}
            />
            <Button type="submit" label="Sair" />
          </div>
        </ModalForm>
      </dialog>
    </>
  );
}
