import { useEffect, useState } from "react";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { AddAdminModal } from "~/components/molecules/users/AddAdminModal";
import { PendingInvitationsList } from "~/components/molecules/users/PendingInvitationsList";
import { useFetchUsers } from "~/hooks/users/useFetchUsers";
import { UserCard } from "~/components/molecules/users/UserCard";
import { Main } from "~/components/atoms/page/Main";
import { Alert } from "~/components/atoms/page/Alert";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";

export default function AdminPageUsers() {
  const [modal, setModal] = useState(false);
  const [pendingKey, setPendingKey] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { users, loading, error, totalPages, fetchAdminUsers, fetchAdminUsersByName } =
    useFetchUsers();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const query = appliedSearch.trim();

    if (query) {
      fetchAdminUsersByName("admin", query, page, size);
    } else {
      fetchAdminUsers("admin", page, size);
    }
  }, [page, appliedSearch, fetchAdminUsers, fetchAdminUsersByName]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(0);
    setAppliedSearch(search.trim());
  }

  return (
    <Main>
      <PageTitle
        title="Administradores"
        description="Consulte o cadastro dos admistradores do sistema"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <form className="w-full sm:w-96 sm:max-w-full" onSubmit={handleSearch}>
          <SearchBar value={search} onChange={setSearch} />
        </form>

        <div className="w-full sm:w-36">
          <Button label="Novo Usuário" onClick={() => setModal(true)} />
        </div>
      </div>

      <PendingInvitationsList roles={["ADMIN"]} refreshKey={pendingKey} />

      {error && <Alert message={error} type="error" />}

      <div className="w-full min-w-0">
        {loading && (
          <p
            className="flex min-h-40 w-full items-center justify-center rounded-xl bg-stone-300 p-4 text-center text-xl text-stone-500"
          >
            Carregando Usuários...
          </p>
        )}

        {users.length != 0 ? (
          <div className="flex w-full min-w-0 flex-col gap-4">
            <div className="flex justify-center">
              <PaginationSelector
                label={"Usuários"}
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
              {users?.map((user) => (
                <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  role={user.role}
                />
              ))}
            </div>
          </div>
        ) : (
          <Alert message="Nenhum usuário encontrado." type="muted" />
        )}
      </div>

      <AddAdminModal
        isOpen={modal}
        onClose={() => {
          setModal(false);
          setPendingKey((key) => key + 1);
        }}
      />
    </Main>
  )
}
