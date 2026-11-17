import clsx from "clsx";
import { FaDog, FaSchool } from "react-icons/fa";

import {
  FiBarChart2,
  FiBookOpen,
  FiFileText,
  FiSearch,
  FiUser,
} from "react-icons/fi";

import { NavbarButton } from "../atoms/NavbarButton";
import { useAuth } from "~/context/AuthContext";
import { HiChip } from "react-icons/hi";

export interface NavbarProps {
  collapsed: boolean;
}

export function Navbar({
  collapsed,
}: NavbarProps) {
  const { user } = useAuth();

  const isStaff =
    user?.role === "ADMIN" ||
    user?.role === "MANAGER";

  const isClassroomMember =
    user?.role === "TEACHER" ||
    user?.role === "STUDENT";

  return (
    <ul
      className={clsx(
        "w-full flex flex-col gap-2",
        "transition-[padding] duration-500",
        collapsed ? "pl-0" : "pl-10",
      )}
    >
      {isStaff && (
        <NavbarButton
          to="/dashboard"
          label="Painel"
          collapse={collapsed}
          icon={FiBarChart2}
        />
      )}

      {isClassroomMember && (
        <NavbarButton
          to="/classrooms"
          label="Turmas"
          collapse={collapsed}
          icon={FiBookOpen}
        />
      )}

      <NavbarButton
        to="/terms"
        label="Termos"
        collapse={collapsed}
        icon={FiFileText}
      />

      {isStaff && (
        <NavbarButton
          to="/audit"
          label="Auditoria"
          collapse={collapsed}
          icon={FiSearch}
        />
      )}

      {user?.role === "ADMIN" && (
        <NavbarButton
          to="/institutions"
          label="Instituições"
          collapse={collapsed}
          icon={FaSchool}
        />
      )}

      {user?.role === "MANAGER" && (
        <NavbarButton
          to={`/institutions/${user.institutionId}`}
          label="Instituição"
          collapse={collapsed}
          icon={FaSchool}
        />
      )}

      {user?.role === "MANAGER" && (
        <NavbarButton
          to={`/institutions/${user.institutionId}/users`}
          label="Membros"
          collapse={collapsed}
          icon={FiUser}
        />
      )}

      {user?.role === "MANAGER" && (
        <NavbarButton
          to={`/institutions/${user.institutionId}/classrooms`}
          label="Turmas"
          collapse={collapsed}
          icon={FiBookOpen}
        />
      )}

      {user?.role === "ADMIN" && (
        <NavbarButton
          to="/users/admins"
          label="Administradores"
          collapse={collapsed}
          icon={FiUser}
        />
      )}

      {user?.role === "ADMIN" && (
        <NavbarButton
          to="/animals"
          label="Animais"
          collapse={collapsed}
          icon={FaDog}
        />
      )}

      {isStaff && (
        <NavbarButton
          to="/devices"
          label="Dispositivos"
          collapse={collapsed}
          icon={HiChip}
        />
      )}
    </ul>
  );
}
