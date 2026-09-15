import { useNavigate } from "react-router";
import { Button } from "~/components/atoms/Button";
import { PageTitle } from "~/components/atoms/PageTitle";
import { SearchBar } from "~/components/atoms/SearchBar";
import { InstitutionCard } from "~/components/organisms/InstitutionCard";
import { useInstitutions } from "~/hooks/useInstitutions";

export default function School() {
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
    <main className="flex flex-1">
      <div className="flex flex-col gap-8 px-12 py-16">
        <PageTitle
          title="Instituições"
          description="Instituições de ensino cadastradas no Echoes."
        />

        <div className="w-48">
          <Button
            label="Nova instituição"
            onClick={() => navigate("/dashboard/school/new")}
          />
        </div>

        <SearchBar
          value={name}
          onChange={setName}
          placeholder="Buscar instituição"
        />

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
                    onOpen={() => navigate(`/dashboard/school/${institution.id}`)}
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
      </div>
    </main>
  );
}
