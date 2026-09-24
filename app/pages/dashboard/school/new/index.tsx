import { FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router";
import { PageTitle } from "~/components/atoms/PageTitle";
import { TextInput } from "~/components/atoms/TextInput";
import { useCreateInstitution } from "~/hooks/useCreateInstitution";
import type { CnpjData } from "~/types/Cnpj";
import { formatCnpjAddress } from "~/utils/cnpj";

export default function NewInstitution() {
  const navigate = useNavigate();
  const form = useCreateInstitution((institution) =>
    navigate(`/dashboard/school/${institution.id}`),
  );

  return (
    <main className="flex flex-1">
      <div className="flex w-full max-w-2xl flex-col gap-8 px-12 py-16">
        <PageTitle
          title="Nova instituição"
          description="Informe o CNPJ para buscar os dados automaticamente na Receita Federal."
        />

        <form className="flex flex-col" onSubmit={form.handleSubmit}>
          <div className="flex flex-col gap-2">
            <p className="text-gray-700 font-medium">CNPJ</p>
            <TextInput
              placeholder="00.000.000/0000-00"
              aria-label="CNPJ"
              value={form.cnpj}
              onChange={(event) => form.setCnpj(event.target.value)}
              inputMode="numeric"
              autoComplete="off"
              maxLength={18}
              required
              className="text-gray-900"
            />
            {form.lookingUp && (
              <span className="text-sm text-slate-500">Consultando CNPJ…</span>
            )}
            {form.lookupError && !form.isFallbackMode && (
              <span className="text-sm text-red-500">{form.lookupError}</span>
            )}
            {form.fieldErrors.cnpj && (
              <span className="text-sm text-red-500">{form.fieldErrors.cnpj}</span>
            )}
          </div>

          {form.isFallbackMode && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
              <FiAlertTriangle size={22} className="mt-0.5 shrink-0 text-amber-600" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold">
                  Não foi possível consultar a Receita Federal.
                </p>
                <p>Preencha os dados manualmente abaixo.</p>
              </div>
            </div>
          )}

          {form.isReady && form.cnpjData && (
            <AutoFilledFields
              data={form.cnpjData}
              acronym={form.acronym}
              email={form.email}
              phone={form.phone}
              fieldErrors={form.fieldErrors}
              onAcronymChange={form.setAcronym}
              onEmailChange={form.setEmail}
              onPhoneChange={form.setPhone}
            />
          )}

          {form.isReady && form.isFallbackMode && (
            <ManualFields
              name={form.name}
              address={form.address}
              acronym={form.acronym}
              email={form.email}
              phone={form.phone}
              fieldErrors={form.fieldErrors}
              onNameChange={form.setName}
              onAddressChange={form.setAddress}
              onAcronymChange={form.setAcronym}
              onEmailChange={form.setEmail}
              onPhoneChange={form.setPhone}
            />
          )}

          {form.generalError && (
            <p className="mt-4 text-sm text-red-500">{form.generalError}</p>
          )}

          <div className="mt-8 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate("/dashboard/school")}
              className="cursor-pointer rounded px-4 py-2 font-medium text-red-500 hover:bg-red-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.isReady || form.submitting}
              className="cursor-pointer rounded bg-main px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {form.submitting ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* ---------- Estado 3A: dados da Receita (read-only cinza) ---------- */

interface AutoFilledFieldsProps {
  data: CnpjData;
  acronym: string; email: string; phone: string;
  fieldErrors: Record<string, string>;
  onAcronymChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}

function AutoFilledFields(p: AutoFilledFieldsProps) {
  return (
    <>
      <ReadOnlyField
        label="Razão social"
        value={p.data.razaoSocial}
        hint="Preenchido automaticamente a partir do CNPJ."
      />
      <ReadOnlyField
        label="Endereço"
        value={formatCnpjAddress(p.data)}
        hint="Preenchido automaticamente a partir do CNPJ."
      />
      <EditableCommon p={p} />
    </>
  );
}

/* ---------- Estado 3D: manual (edição livre) ---------- */

interface ManualFieldsProps {
  name: string; address: string;
  acronym: string; email: string; phone: string;
  fieldErrors: Record<string, string>;
  onNameChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onAcronymChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}

function ManualFields(p: ManualFieldsProps) {
  return (
    <>
      <Field label="Razão social" error={p.fieldErrors.name}>
        <TextInput
          placeholder="Digite a razão social"
          aria-label="Razão social"
          value={p.name}
          onChange={(e) => p.onNameChange(e.target.value)}
          required
          className="text-gray-900"
        />
      </Field>
      <Field label="Endereço" error={p.fieldErrors.address}>
        <TextInput
          placeholder="Digite o endereço"
          aria-label="Endereço"
          value={p.address}
          onChange={(e) => p.onAddressChange(e.target.value)}
          required
          className="text-gray-900"
        />
      </Field>
      <EditableCommon p={p} />
    </>
  );
}

/* ---------- Blocos reutilizáveis ---------- */

function ReadOnlyField(props: { label: string; value: string; hint: string }) {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <p className="text-gray-700 font-medium">{props.label}</p>
      <div className="rounded border border-slate-200 bg-slate-50 px-4 py-2 text-gray-900">
        {props.value || "—"}
      </div>
      <span className="text-xs text-slate-500">{props.hint}</span>
    </div>
  );
}

function Field(props: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col gap-2">
      <p className="text-gray-700 font-medium">{props.label}</p>
      {props.children}
      {props.error && <span className="text-sm text-red-500">{props.error}</span>}
    </div>
  );
}

function EditableCommon(p: {
  acronym: string; email: string; phone: string;
  fieldErrors: Record<string, string>;
  onAcronymChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
}) {
  return (
    <>
      <Field label="Sigla" error={p.fieldErrors.acronym}>
        <TextInput
          placeholder="Digite a sigla"
          aria-label="Sigla"
          value={p.acronym}
          onChange={(e) => p.onAcronymChange(e.target.value)}
          required
          className="text-gray-900"
        />
      </Field>
      <Field label="E-mail" error={p.fieldErrors.email}>
        <TextInput
          type="email"
          placeholder="Digite o e-mail"
          aria-label="E-mail"
          value={p.email}
          onChange={(e) => p.onEmailChange(e.target.value)}
          required
          className="text-gray-900"
        />
      </Field>
      <Field label="Telefone" error={p.fieldErrors.phone}>
        <TextInput
          placeholder="Digite o telefone"
          aria-label="Telefone"
          value={p.phone}
          onChange={(e) => p.onPhoneChange(e.target.value)}
          className="text-gray-900"
        />
      </Field>
    </>
  );
}
