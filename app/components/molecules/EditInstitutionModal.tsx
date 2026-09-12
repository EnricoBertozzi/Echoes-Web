import { Dialog } from "radix-ui";
import { useEffect, useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { useUpdateInstitution } from "~/hooks/useUpdateInstitution";
import { formatCnpj, unmaskCnpj } from "~/utils/cnpj";
import type { Institution } from "~/types/Institution";

interface EditInstitutionModalProps {
  institution: Institution | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: (institution: Institution) => void;
}

export function EditInstitutionModal({
  institution,
  onOpenChange,
  onUpdated,
}: EditInstitutionModalProps) {
  const [form, setForm] = useState({
    name: "",
    acronym: "",
    cnpj: "",
    email: "",
    phone: "",
  });
  const { update, loading, error } = useUpdateInstitution();

  useEffect(() => {
    if (institution) {
      setForm({
        name: institution.name,
        acronym: institution.acronym,
        cnpj: formatCnpj(institution.cnpj),
        email: institution.email,
        phone: institution.phone ?? "",
      });
    }
  }, [institution]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!institution) return;

    const updated = await update(institution.id, {
      name: form.name,
      acronym: form.acronym,
      cnpj: unmaskCnpj(form.cnpj),
      email: form.email,
      phone: form.phone || null,
    });
    if (updated) {
      onUpdated(updated);
      onOpenChange(false);
    }
  }

  return (
    <Dialog.Root open={institution !== null} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-800">
              Editar instituição
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="cursor-pointer text-zinc-500 hover:text-zinc-800"
                aria-label="Fechar"
              >
                <FiX className="text-xl" />
              </button>
            </Dialog.Close>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <TextInput
              id="edit-name"
              label="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextInput
              id="edit-acronym"
              label="Sigla"
              required
              value={form.acronym}
              onChange={(e) => setForm({ ...form, acronym: e.target.value })}
            />
            <TextInput
              id="edit-cnpj"
              label="CNPJ"
              required
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            />
            <TextInput
              id="edit-email"
              label="E-mail"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextInput
              id="edit-phone"
              label="Telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="mt-2 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
