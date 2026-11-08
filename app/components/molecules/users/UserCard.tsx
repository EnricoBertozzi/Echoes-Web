import { FaUser, FaUserGroup } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";

export interface UserCardProps {
  name: string;
  email: string;
  role: string;
}

export function UserCard({ name, email, role }: UserCardProps) {
  let labelRole = "";
  if (role === "STUDENT") 
    labelRole = "Estudante";
  else if (role === "MANAGER")
    labelRole = "Gestor";
  else if (role === "TEACHER")
    labelRole = "Professor";
  
  return (
    <div className="flex flex-row gap-4 items-center rounded-lg p-5 w-full bg-white">
      
      <div className="flex size-16 aspect-square shrink-0 items-center justify-center rounded-full bg-main text-white">
        <span className="text-2xl font-bold">{name.charAt(0)}</span>
      </div>

      <div className="min-w-0 w-full flex flex-col justify-between">
        <p className="font-bold text-xl text-black max-w-full truncate">
          {name}
        </p>

        <p className="flex flex-row gap-2 items-center text-black">
          <span className="text-xl font-bold align-middle truncate">{email}</span>
        </p>

        <p className="px-4 py-0.5 flex gap-2 items-center w-fit text-white bg-main rounded-full">
          <FaUser size={16} />
          <span className="text-base truncate">{labelRole}</span>
        </p>
      </div>
    </div>
  );
}
