import { useEffect, useState, type FormEvent } from "react";
import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { formatCnpj, unmaskCnpj } from "~/utils/cnpj";
import type { Institution, InstitutionPayload } from "~/types/Institution";

interface InstitutionFormProps {
  initialInstitution?: Institution | null;
  submitting: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: (payload: InstitutionPayload) => void;
  onCancel: () => void;
}

const emptyForm = {
  name: "",
  acronym: "",
  cnpj: "",
  email: "",
  phone: "",
  address: "",
};

export function InstitutionForm({
  initialInstitution,
  submitting,
  error,
  submitLabel,
  onSubmit,
  onCancel,
}: InstitutionFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialInstitution) {
      setForm({
        name: initialInstitution.name,
        acronym: initialInstitution.acronym,
        cnpj: formatCnpj(initialInstitution.cnpj),
        email: initialInstitution.email,
        phone: initialInstitution.phone ?? "",
        address: initialInstitution.address,
      });
    }
  }, [initialInstitution]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      name: form.name,
      acronym: form.acronym,
      cnpj: unmaskCnpj(form.cnpj),
      email: form.email,
      phone: form.phone || null,
      address: form.address,
    });
  }

  return (
    <form
      className="flex max-w-lg flex-col gap-4 rounded bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <TextInput
        id="institution-name"
        label="Nome"
        required
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <TextInput
        id="institution-acronym"
        label="Sigla"
        required
        value={form.acronym}
        onChange={(e) => setForm({ ...form, acronym: e.target.value })}
      />
      <TextInput
        id="institution-cnpj"
        label="CNPJ"
        required
        value={form.cnpj}
        onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
      />
      <TextInput
        id="institution-email"
        label="E-mail"
        type="email"
        required
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <TextInput
        id="institution-phone"
        label="Telefone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <TextInput
        id="institution-address"
        label="Endereço"
        required
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
