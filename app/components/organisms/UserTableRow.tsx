import { FiTrash2 } from "react-icons/fi";
import type { User } from "~/types/user"
import { EditUserModal } from "../molecules/EditUserModal";

export interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {

  const label = user.role === 'admin' ? 'Administrador' :
    user.role === 'manager' ? 'Gestor' :
    user.role === 'teacher' ? 'Professor' :
    'Estudante'

  return (
      <tr className='text-black border-t border-b border-gray-800/20'>
        <td className="w-1/4 px-4 py-2">
        {user.name}
        </td>

        <td className="w-1/4 px-4 py-2 border-l border-gray-800/20">
        {user.email}
        </td>

        <td className="w-1/4 px-4 py-2 border-l border-gray-800/20">
        {label}
        </td>

        <td className="w-1/12 px-4 py-2 border-l border-gray-800/20">
          <div className='w-full h-full flex flex-row justify-center items-center gap-3'>
            <EditUserModal user={user}/>
            <button className='cursor-pointer'>
              <FiTrash2
              size={24}
              className='text-main hover:text-main/50 transition-all'
              />
            </button>
          </div>
        </td>
      </tr>
  )
}
