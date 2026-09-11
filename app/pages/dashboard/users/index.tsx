import { FiPlus } from "react-icons/fi";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { UserTableRow } from "~/components/atoms/UserTableRow";

export default function Devices() {
  return (
  <main className="flex flex-1 flex-col justify-center items-center">
    <div className='w-9/12 h-10 px-10 text-black flex flex-row justify-between items-center'>
      <h2 className='text-lg font-medium'>Usuários</h2>
      <button className='cursor-pointer'>
        <FiPlus
          className='text-main hover:text-main/50 transition-all'
          size={24}
        />
      </button>
    </div>
    <div className="w-full max-w-5xl">
      {/* Header */}
      <table className="w-full table-fixed">
        <thead className="bg-main">
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
      <div className="max-h-80 overflow-y-auto scrollbar-thin rounded-b-md border border-main/50">
        <table className="w-full table-fixed">
          <tbody>
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
            <UserTableRow
              user={{
                name: 'Nome do usuário',
                email: 'usuario@email.com',
                role: 'admin',
              }}
            />
          </tbody>
        </table>
      </div>
    </div>
  </main>
  )
}
