import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { AddUserModal } from "~/components/molecules/AddUserModal";
import { UserTableRow } from "~/components/organisms/UserTableRow";
import { useUsers } from "~/hooks/useUsers";
import { userRoleLabels, userRoles } from "~/types/user";

export default function Users() {
  const {
    role,
    setRole,
    page,
    setPage,
    users,
    totalElements,
    totalPages,
    loading,
    error,
    refetch,
    hasNextPage,
    hasPrevPage,
  } = useUsers();

  return (
    <main className="flex flex-1 flex-col justify-center items-center">
      <div className='w-full max-w-5xl flex flex-row justify-between items-center'>
        <h2 className='text-lg text-black font-medium'>Usuários</h2>
        <AddUserModal onCreated={refetch} />
      </div>

      <div className='w-full max-w-5xl mt-4 flex flex-row flex-wrap gap-2'>
        {userRoles.map((roleOption) => (
          <button
            key={roleOption}
            onClick={() => setRole(roleOption)}
            className={`rounded px-4 py-1.5 text-sm cursor-pointer transition-all ${
              role === roleOption
                ? 'bg-main text-white'
                : 'bg-white text-black border border-main/30 hover:border-main'
            }`}
          >
            {userRoleLabels[roleOption]}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl mt-4">
        {/* Header */}
        <table className="w-full table-fixed">
          <thead className="bg-main text-white">
            <tr>
              <TableHeadColumn className="w-1/4 rounded-tl-md">
                Nome
              </TableHeadColumn>

              <TableHeadColumn className="w-1/4">
                E-mail
              </TableHeadColumn>

              <TableHeadColumn className="w-1/4">
                Função
              </TableHeadColumn>

              <TableHeadColumn className="w-1/12 rounded-tr-md">
                Ações
              </TableHeadColumn>
            </tr>
          </thead>
        </table>

        {/* Body */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin rounded-b-md border border-t-0 border-main/50">
          {loading ? (
            <div className="flex justify-center items-center h-24 text-black">
              Carregando usuários...
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-24 gap-2">
              <span className="text-sm text-red-500">{error}</span>
              <button
                onClick={refetch}
                className="rounded bg-main px-4 py-1.5 text-white text-sm cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center h-24 text-black">
              Nenhum usuário encontrado
            </div>
          ) : (
            <table className="w-full table-fixed">
              <tbody>
                {users.map((user) => (
                  <UserTableRow key={user.id} user={user} onChanged={refetch} />
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-row justify-between items-center">
          <span className="text-sm text-black">
            Página {page + 1} de {Math.max(totalPages, 1)} · {totalElements} usuários
          </span>

          <div className="flex flex-row gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!hasPrevPage}
              aria-label="Página anterior"
              className="cursor-pointer disabled:opacity-40"
            >
              <FiChevronLeft size={24} className="text-main" />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage}
              aria-label="Próxima página"
              className="cursor-pointer disabled:opacity-40"
            >
              <FiChevronRight size={24} className="text-main" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
