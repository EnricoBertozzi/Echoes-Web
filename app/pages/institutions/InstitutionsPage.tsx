import { useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { InstitutionCard } from "~/components/organisms/InstitutionCard";
import { useInstitutions } from "~/hooks/useInstitutions";

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

      <div className="flex flex-row flex-wrap items-center justify-between gap-4">
        <form className="w-96">
          <SearchBar
            value={name}
            onChange={setName}
            placeholder="Buscar..."
          />
        </form>

        <div className="w-36">
          <Button
            label="Nova instituição"
            onClick={() => navigate("/institutions/new")}
          />
        </div>
      </div>

      <div className="overflow-y-scroll">
        {loading ? (
          <p className="text-xl text-slate-500">Carregando...</p>
        ) : error ? (
          <p className="text-xl text-red-500">{error}</p>
        ) : institutions.length === 0 ? (
          <p className="text-xl text-slate-500">
            Nenhuma instituição encontrada.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-8">
            {institutions.map((institution) => (
              <li key={institution.id}>
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
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPage(page - 1)}
            disabled={!hasPrevPage}
            className="cursor-pointer text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
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
            className="cursor-pointer text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próxima
          </button>
        </div>
      )}
    </Main>
  );
}
