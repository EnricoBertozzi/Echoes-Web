import { useEffect, useState } from "react";
import { useConfirmation } from "~/context/ConfirmationContext";
import clsx from "clsx";
import type { IconType } from "react-icons";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { useFetchUsers } from "~/hooks/users/useFetchUsers";
import { UserCard } from "~/components/molecules/users/UserCard";
import { Main } from "~/components/atoms/page/Main";
import { Alert } from "~/components/atoms/page/Alert";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";
import { useParams } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { AddInstitutionalUserModal } from "~/components/molecules/users/AddInstitutionalUserModal";
import { PendingInvitationsList } from "~/components/molecules/users/PendingInvitationsList";
import { deleteUser } from "~/api/users";
import { roleToUserRole, type User } from "~/types/user";
import { fullName } from "~/types/user";

type RoleFilter = "all" | "manager" | "teacher" | "student";

const roleFilters: { value: RoleFilter; label: string; icon: IconType }[] = [
  { value: "all", label: "Todos", icon: FaUsers },
  { value: "manager", label: "Gestores", icon: FaUserTie },
  { value: "teacher", label: "Professores", icon: FaChalkboardTeacher },
  { value: "student", label: "Alunos", icon: FaUserGraduate },
];

export default function InstitutionUsersPage() {
  const confirmAction = useConfirmation();
  const [modal, setModal] = useState(false);
  const [pendingKey, setPendingKey] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [refetchKey, setRefetchKey] = useState(0);
  const { institutionId } = useParams();
  const { user } = useAuth();

  const {
    users,
    loading,
    error,
    totalPages,
    fetchAdminUsers,
    fetchUsersByInstitution,
    fetchUsersByNameInInstitution,
  } = useFetchUsers();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    const query = appliedSearch.trim();

    if (roleFilter !== "all") {
      // Lista só o papel escolhido, dentro da instituição
      fetchAdminUsers(roleFilter, page, size, institutionId!);
    } else if (query) {
      fetchUsersByNameInInstitution(institutionId!, query, page, size);
    } else {
      fetchUsersByInstitution(institutionId!, page, size);
    }
  }, [
    page,
    size,
    appliedSearch,
    roleFilter,
    institutionId,
    refetchKey,
    fetchAdminUsers,
    fetchUsersByInstitution,
    fetchUsersByNameInInstitution,
  ]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(0);
    setAppliedSearch(search.trim());
  }

  function handleRoleChange(value: RoleFilter) {
    setRoleFilter(value);
    setPage(0);
  }

  async function handleDelete(member: User) {
    const confirmed = await confirmAction({
      title: "Excluir usuário",
      description: `Excluir o usuário ${fullName(member)}?`,
      confirmLabel: "Excluir",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await deleteUser(roleToUserRole(member.role), member.id);
      setRefetchKey((key) => key + 1);
    } catch {
      // o interceptor do axios já mostrou o erro
    }
  }

  // Com um papel escolhido, a busca por nome filtra a página carregada
  const query = appliedSearch.toLowerCase();
  const visibleUsers =
    roleFilter !== "all" && query
      ? users.filter((u) => fullName(u).toLowerCase().includes(query))
      : users;

  const isManager = user?.role === "MANAGER";

  return (
    <Main>
      <PageTitle
        title="Membros"
        description="Consulte o cadastro dos membros da instituição"
        backPath={
          user?.role == "ADMIN"
            ? "/institutions"
            : `/institutions/${user?.institutionId}`
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <form className="w-full sm:w-96 sm:max-w-full" onSubmit={handleSearch}>
          <SearchBar value={search} onChange={setSearch} />
        </form>

        <div className="w-full sm:w-36">
          <Button
            label="Novo Usuário"
            onClick={() => setModal(true)}
            variant={"primary"}
          />
        </div>
      </div>

      <div
        role="group"
        aria-label="Filtrar por função"
        className="flex flex-wrap gap-3"
      >
        {roleFilters.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            aria-pressed={roleFilter === value}
            onClick={() => handleRoleChange(value)}
            className={clsx(
              "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-colors",
              roleFilter === value
                ? "border-main bg-main text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <PendingInvitationsList
        institutionId={institutionId}
        refreshKey={pendingKey}
      />

      {error && <Alert message={error} type="error" />}

      <div className="w-full min-w-0">
        {loading && (
          <p
            className="flex min-h-40 w-full items-center justify-center rounded-xl bg-stone-300 p-4 text-center text-xl text-stone-500"
          >
            Carregando Usuários...
          </p>
        )}

        {visibleUsers.length != 0 ? (
          <div className="flex w-full min-w-0 flex-col gap-4">
            <div className="flex justify-center">
              <PaginationSelector
                label={"Membros: "}
                size={size}
                page={page}
                totalPages={totalPages}
                nextPage={() => setPage(page + 1)}
                prevPage={() => setPage(page - 1)}
                sizeOptions={[6, 12, 24]}
                onChange={(value) => {
                  setSize(Number(value));
                  setPage(0);
                }}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {visibleUsers.map((member) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={fullName(member)}
                  role={member.role}
                  onDelete={
                    isManager && member.id !== user?.id
                      ? () => handleDelete(member)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ) : (
          <Alert message="Nenhum usuário encontrado." type="muted" />
        )}
      </div>

      <AddInstitutionalUserModal
        isOpen={modal}
        onClose={() => {
          setModal(false);
          setPendingKey((key) => key + 1);
        }}
        institutionId={institutionId!}
      />
    </Main>
  );
}
