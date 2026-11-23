import { useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { InstitutionCard } from "~/components/organisms/InstitutionCard";
import { useInstitutions } from "~/hooks/institutions/useInstitutions";

export default function InstitutionsPage() {
  const navigate = useNavigate();

  const {
    name,
    setName,
    page,
    setPage,
    institutions,
    totalPages,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
  } = useInstitutions();

  return (
    <Main>
      <PageTitle
        title="Instituições"
        description="Instituições de ensino cadastradas no Echoes."
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <form className="w-full sm:w-96 sm:max-w-full">
          <SearchBar
            value={name}
            onChange={setName}
            placeholder="Buscar..."
          />
        </form>

        <div className="w-full sm:w-36">
          <Button
            label="Nova instituição"
            onClick={() => navigate("/institutions/new")}
          />
        </div>
      </div>

      <div className="min-w-0">
        {loading ? (
          <p className="text-xl text-slate-500">Carregando...</p>
        ) : error ? (
          <p className="text-xl text-red-500">{error}</p>
        ) : institutions.length === 0 ? (
          <p className="text-xl text-slate-500">
            Nenhuma instituição encontrada.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] sm:gap-6">
            {institutions.map((institution) => (
              <li key={institution.id} className="min-w-0">
                <InstitutionCard
                  institution={institution}
                  onOpen={() => navigate(`/institutions/${institution.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            className="min-h-11 cursor-pointer text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-slate-600">
            Página {page + 1} de {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            className="min-h-11 cursor-pointer text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </Main>
  );
}
