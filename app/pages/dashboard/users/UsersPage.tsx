import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { TableHeadColumn } from "~/components/atoms/TableHeadColumn";
import { AddAdminModal } from "~/components/molecules/users/AddAdminModal";
import { UserTableRow } from "~/components/organisms/UserTableRow";
import { useUsers } from "~/hooks/useUsers";
import { userRoleLabels, userRoles } from "~/types/user";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { UserCard } from "~/components/molecules/users/UserCard";

type ModalState =
  | { type: "create" }
  | { type: "edit" }
  | { type: "delete" }
  | null;

export default function Users() {
  const [modal, setModal] = useState<ModalState>(null);

  // const { refetch } = useUsers();

  return (
    <main className="min-w-0 flex-1">
      <div className="flex flex-col gap-8 px-12 py-16">
        <PageTitle title="Usuários" description="Consulte o cadastro dos admistradores do sistema" />

        <div className="flex flex-row flex-wrap items-center justify-between gap-4">
          <SearchBar value={""} onChange={() => console.log()} />

          <div className="w-36">
            <Button
              label="Novo Usuário"
              onClick={() => setModal({ type: "create" })}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <UserCard name="Manoella" email="enrico@123.com" role="Admin" />
        </div>
      </div>

      <AddAdminModal
        isOpen={modal?.type === "create"}
        onClose={() => setModal(null)}
        // onCreated={refetch}
      />
    </main>
  );
}
