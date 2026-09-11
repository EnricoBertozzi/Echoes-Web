import { FiTrash2 } from "react-icons/fi";
import { roleToUserRole, userRoleLabels } from "~/types/user";
import type { User } from "~/types/user";
import { useDeleteUser } from "~/hooks/useDeleteUser";
import { EditUserModal } from "../molecules/EditUserModal";

export interface UserTableRowProps {
  user: User;
  onChanged?: () => void;
}

export function UserTableRow({ user, onChanged }: UserTableRowProps) {
  const { deleting, deleteError, handleDelete } = useDeleteUser(user, onChanged);

  const label = userRoleLabels[roleToUserRole(user.role)];

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
        <div className='w-full h-full flex flex-col justify-center items-center gap-1'>
          <div className='flex flex-row justify-center items-center gap-3'>
            <EditUserModal user={user} onUpdated={onChanged} />
            <button
              className='cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
              aria-label={`Excluir usuário ${user.name}`}
              onClick={handleDelete}
              disabled={deleting}
            >
              <FiTrash2
                size={24}
                className='text-main hover:text-main/50 transition-all'
              />
            </button>
          </div>
          {deleteError && (
            <span className='text-xs text-red-500 text-center'>
              {deleteError}
            </span>
          )}
        </div>
      </td>
    </tr>
  )
}
