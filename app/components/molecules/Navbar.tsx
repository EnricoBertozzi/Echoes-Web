import clsx from "clsx";
import { FaDog, FaSchool } from "react-icons/fa";
import {
  FiBarChart2,
  FiFileText,
  FiSearch,
  FiSliders,
  FiUser,
} from "react-icons/fi";
import { NavbarButton } from "../atoms/NavbarButton";
import { useAuth } from "~/context/AuthContext";

export interface NavbarProps {
  collapsed: boolean;
}

export function Navbar({ collapsed }: NavbarProps) {
  const { user } = useAuth();

  return (
    <ul
      className={clsx(
        "w-full flex flex-col gap-2",
        "transition-[padding] duration-500",
        collapsed ? "pl-0" : "pl-10",
      )}
    >
      {(user?.role == "ADMIN" || user?.role == "MANAGER") && (
        <NavbarButton
          to="/dashboard"
          label="Painel"
          collapse={collapsed}
          icon={FiBarChart2}
        />
      )}
      {/* <NavbarButton
          to='/devices'
          label='Dispositivos'
          collapse={collapsed}
          icon={FaDog}
          end
        /> */}
      <NavbarButton
        to="/terms"
        label="Termos"
        collapse={collapsed}
        icon={FiFileText}
      />
      {/* <NavbarButton
          to='/audit'
          label='Auditoria'
          collapse={collapsed}
          icon={FiSearch}
        /> */}
      {user?.role == "ADMIN" && (
        <NavbarButton
          to="/institutions"
          label="Instituições"
          collapse={collapsed}
          icon={FaSchool}
        />
      )}
      
      {user?.role == "MANAGER" && (
        <NavbarButton
          to={`/institutions/${user?.institutionId}`}
          label="Instituição"
          collapse={collapsed}
          icon={FaSchool}
        />
      )}

      {user?.role == "MANAGER" && (
        <NavbarButton
          to={`/institutions/${user.institutionId}/users`}
          label="Membros"
          collapse={collapsed}
          icon={FiUser}
        />
      )}

      {user?.role == "ADMIN" && (
        <NavbarButton
          to="/users/admins"
          label="Administradores"
          collapse={collapsed}
          icon={FiUser}
        />
      )}

      <NavbarButton
        to="/animals"
        label="Animais"
        collapse={collapsed}
        icon={FaDog}
      />
    </ul>
  );
}
