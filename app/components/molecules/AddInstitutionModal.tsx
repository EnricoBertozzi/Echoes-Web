import { Dialog } from "radix-ui";
import { useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import { Button } from "~/components/atoms/Button";
import { TextInput } from "~/components/atoms/TextInput";
import { useCreateInstitution } from "~/hooks/useCreateInstitution";
import { unmaskCnpj } from "~/utils/cnpj";
import type { Institution } from "~/types/Institution";

interface AddInstitutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (institution: Institution) => void;
}

const emptyForm = { name: "", acronym: "", cnpj: "", email: "", phone: "" };

export function AddInstitutionModal({
  open,
  onOpenChange,
  onCreated,
}: AddInstitutionModalProps) {
  const [form, setForm] = useState(emptyForm);
  const { create, loading, error } = useCreateInstitution();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const created = await create({
      name: form.name,
      acronym: form.acronym,
      cnpj: unmaskCnpj(form.cnpj),
      email: form.email,
      phone: form.phone || null,
    });
    if (created) {
      onCreated(created);
      setForm(emptyForm);
      onOpenChange(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-zinc-800">
              Nova instituição
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
              id="add-name"
              label="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextInput
              id="add-acronym"
              label="Sigla"
              required
              value={form.acronym}
              onChange={(e) => setForm({ ...form, acronym: e.target.value })}
            />
            <TextInput
              id="add-cnpj"
              label="CNPJ"
              required
              value={form.cnpj}
              onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
            />
            <TextInput
              id="add-email"
              label="E-mail"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextInput
              id="add-phone"
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
