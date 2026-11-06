import { useEffect, useState } from "react";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { AddAdminModal } from "~/components/molecules/users/AddAdminModal";
import { useUsers } from "~/hooks/users/useFetchUsers";
import { UserCard } from "~/components/molecules/users/UserCard";
import { Main } from "~/components/atoms/page/Main";
import { Alert } from "~/components/atoms/page/Alert";
import { PaginationSelector } from "~/components/atoms/page/PaginationSelector";

export default function Users() {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const { users, loading, error, totalPages, fetchUsers, fetchUserByName } =
    useUsers();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const query = appliedSearch.trim();

    if (query) {
      fetchUserByName("admin", query, page, size);
    } else {
      fetchUsers("admin", page, size);
    }
  }, [page, appliedSearch, fetchUsers, fetchUserByName]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(0);
    setAppliedSearch(search.trim());
  }

  return (
    <Main>
      <PageTitle
        title="Usuários"
        description="Consulte o cadastro dos admistradores do sistema"
      />

      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <form className="w-96" onSubmit={handleSearch}>
          <SearchBar value={search} onChange={setSearch} />
        </form>

        <div className="w-36">
          <Button label="Novo Usuário" onClick={() => setModal(true)} />
        </div>
      </div>

      {error && <Alert message={error} type="error" />}

      <div className="min-w-0 w-full h-full">
        {loading && (
          <p
            className="w-full h-full rounded-xl 
              flex justify-center items-center text-xl 
            bg-stone-300 text-stone-500"
          >
            Carregando Usuários...
          </p>
        )}

        {users.length != 0 ? (
          <div className="w-full h-full overflow-scroll">
            <div className="flex justify-center">
              <PaginationSelector
                label={""}
                size={0}
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
                  name={user.name}
                  email={user.email}
                  role={user.role}
                />
              ))}
            </div>
          </div>
        ) : (
          <Alert message="Nenhum usuário encontrado." type="muted" />
        )}
      </div>

      <AddAdminModal isOpen={modal} onClose={() => setModal(false)} />
    </Main>
  )
}
