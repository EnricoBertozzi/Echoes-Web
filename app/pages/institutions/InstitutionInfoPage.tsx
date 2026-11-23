import { useNavigate, useParams } from "react-router";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCheckCircle,
  FiCpu,
  FiEdit,
  FiFileText,
  FiHome,
  FiMail,
  FiMapPin,
  FiPhone,
  FiTrash2,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import type { IconType } from "react-icons";

import { Button } from "~/components/atoms/Button";
import { Card } from "~/components/atoms/card/Card";
import { Alert } from "~/components/atoms/page/Alert";
import { Main } from "~/components/atoms/page/Main";
import { PageTitle } from "~/components/atoms/PageTitle";

import { useAuth } from "~/context/AuthContext";
import { useDeleteInstitution } from "~/hooks/institutions/useDeleteInstitution";
import { useInstitution } from "~/hooks/institutions/useInstitution";
import { useToggleInstitutionStatus } from "~/hooks/institutions/useToggleInstitutionStatus";

import type { Institution } from "~/types/Institution";
import { formatCnpj } from "~/utils/cnpj";
import { InstitutionNavigationCard } from "~/components/organisms/institutions/InstitutionNavegationCard";
import { InfoItem as InstitutionInfoItem } from "~/components/molecules/InfoItem";
import { ButtonIcon } from "~/components/atoms/ButtonIcon";

export default function InstitutionDetail() {
  const { institutionId } = useParams();
  const navigate = useNavigate();

  const { institution, loading, error, refetch } =
    useInstitution(institutionId);

  if (loading) {
    return (
      <Main>
        <PageTitle title="Instituição" description={""} />

        <p className="flex h-40 items-center justify-center rounded-xl bg-stone-300 text-xl text-stone-500">
          Carregando instituição...
        </p>
      </Main>
    );
  }

  if (error || !institution) {
    return (
      <Main>
        <PageTitle title="Instituição" description={""} />

        <Alert message={error ?? "Instituição não encontrada"} type="error" />
      </Main>
    );
  }

  return (
    <InstitutionInfoPage
      institution={institution}
      onRefetch={refetch}
      onEdit={() => navigate(`/institutions/${institution.id}/edit`)}
      onDeleted={() => navigate("/institutions")}
    />
  );
}

interface InstitutionInfoPageProps {
  institution: Institution;
  onRefetch: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

function InstitutionInfoPage({
  institution,
  onRefetch,
  onEdit,
  onDeleted,
}: InstitutionInfoPageProps) {
  const navigate = useNavigate();

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { deleting, deleteError, handleDelete } = useDeleteInstitution(
    institution,
    onDeleted,
  );

  const { toggling, toggleError, handleToggle } = useToggleInstitutionStatus(
    institution,
    onRefetch,
  );

  const isManager = user?.role === "MANAGER";

  const busy = deleting || toggling;

  return (
    <Main>
      <PageTitle
        backPath={isAdmin ? "/institutions" : undefined}
        title="Detalhes da instituição"
        description="Consulte as informações da instituição."
      />

      <div className="flex w-full min-w-0 flex-col gap-8">
        <Card>
          <div className="flex flex-col gap-6">
            <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-x-6">
              <div className="col-start-1 row-start-1 grid size-16 place-items-center rounded-2xl bg-main sm:size-20">
                <FiHome className="size-7 text-white sm:size-9" aria-hidden="true" />
              </div>

              <div
                className={`col-start-1 col-end-3 row-start-2 flex min-w-0 flex-col gap-2 wrap-anywhere sm:col-start-2 sm:row-start-1 sm:self-center ${
                  isAdmin ? "" : "sm:col-end-4"
                }`}
              >
                <h2 className="text-2xl leading-tight font-bold text-slate-900">
                  {institution.name}
                </h2>

                <p className="text-sm text-slate-500">{institution.acronym}</p>

                <div
                  className={`flex items-center gap-2 text-sm font-medium ${
                    institution.active ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {institution.active ? (
                    <FiCheckCircle size={16} className="shrink-0" aria-hidden="true" />
                  ) : (
                    <FiXCircle size={16} className="shrink-0" aria-hidden="true" />
                  )}
                  {institution.active ? "Ativa" : "Desativada"}
                </div>
              </div>

              {isAdmin && (
                <div className="col-start-2 row-start-1 justify-self-end sm:col-start-3">
                  <ButtonIcon
                    label={`Editar instituição ${institution.name}`}
                    onClick={onEdit}
                  >
                    <FiEdit size={22} className="text-slate-900" aria-hidden="true" />
                  </ButtonIcon>
                </div>
              )}
            </header>

            <hr className="border-slate-200" />

            <dl className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <InstitutionInfoItem
                icon={FiFileText}
                label="CNPJ"
                value={formatCnpj(institution.cnpj)}
              />

              <InstitutionInfoItem
                icon={FiMail}
                label="E-mail"
                value={institution.email}
              />

              <InstitutionInfoItem
                icon={FiPhone}
                label="Telefone"
                value={institution.phone || "Não informado"}
              />

              <InstitutionInfoItem
                icon={FiMapPin}
                label="Endereço"
                value={institution.address || "Não informado"}
              />
            </dl>

            <hr className="border-slate-200" />

            <div className="flex flex-col gap-1">
              <span className="text-sm text-slate-500">
                Identificador da instituição
              </span>

              <span className="break-all font-mono text-xs text-slate-600">
                {institution.id}
              </span>
            </div>
          </div>
        </Card>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-slate-900">
              Gerenciamento institucional
            </h2>

            <p className="text-sm text-slate-500">
              Acesse os recursos vinculados à instituição.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InstitutionNavigationCard
              icon={FiUsers}
              title="Membros"
              description="Consulte os usuários vinculados à instituição."
              onClick={() => navigate(`/institutions/${institution.id}/users`)}
            />

            <InstitutionNavigationCard
              icon={FiBookOpen}
              title="Turmas"
              description="Acesse as turmas da instituição."
              onClick={() =>
                navigate(`/institutions/${institution.id}/classrooms`)
              }
            />

            {isManager && user?.institutionId === institution.id && (
              <InstitutionNavigationCard
                icon={FiCpu}
                title="Dispositivos e turmas"
                description="Atribua, transfira e remova dispositivos das turmas."
                onClick={() =>
                  navigate(`/institutions/${institution.id}/devices`)
                }
              />
            )}
          </div>
        </section>

        {isAdmin && (
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-slate-900">
                Administração
              </h2>

              <p className="text-sm text-slate-500">
                Controle a disponibilidade e o registro da instituição.
              </p>
            </div>

            <Card>
              {toggleError && <Alert message={toggleError} type="error" />}

              {deleteError && <Alert message={deleteError} type="error" />}

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-900">
                      Status da instituição
                    </h3>

                    <p className="text-sm text-slate-500">
                      {institution.active
                        ? "A instituição está ativa e disponível."
                        : "A instituição está desativada."}
                    </p>
                  </div>

                  <div className="w-full sm:w-32 sm:shrink-0">
                    <Button
                      label={
                        toggling
                          ? "Salvando..."
                          : institution.active
                            ? "Desativar"
                            : "Ativar"
                      }
                      onClick={handleToggle}
                      disabled={busy}
                      type="button"
                      variant={institution.active ? "danger" : "primary"}
                    />
                  </div>
                </div>

                <hr className="border-slate-200" />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-900">
                      Excluir instituição
                    </h3>

                    <p className="text-sm text-slate-500">
                      Remova a instituição do sistema.
                    </p>
                  </div>

                  <div className="w-full sm:w-32 sm:shrink-0">
                    <Button
                      label={deleting ? "Excluindo..." : "Excluir"}
                      onClick={handleDelete}
                      disabled={busy}
                      type="button"
                      variant="danger"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}
      </div>
    </Main>
  );
}
