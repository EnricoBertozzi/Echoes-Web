import type { ClassroomMember } from "~/types/Classroom";

export interface ClassroomAccent {
  /** fundo do banner do cartão e do cabeçalho (texto branco por cima) */
  banner: string;
  /** cor do texto das iniciais sobre o quadrado branco */
  text: string;
}

// Classes escritas por extenso para o Tailwind enxergá-las no build.
const ACCENTS: ClassroomAccent[] = [
  { banner: "bg-indigo-700", text: "text-indigo-700" },
  { banner: "bg-teal-700", text: "text-teal-700" },
  { banner: "bg-rose-700", text: "text-rose-700" },
  { banner: "bg-amber-700", text: "text-amber-700" },
  { banner: "bg-emerald-700", text: "text-emerald-700" },
  { banner: "bg-sky-700", text: "text-sky-700" },
  { banner: "bg-fuchsia-700", text: "text-fuchsia-700" },
  { banner: "bg-violet-700", text: "text-violet-700" },
];

const ARCHIVED_ACCENT: ClassroomAccent = {
  banner: "bg-stone-500",
  text: "text-stone-600",
};

/** Cada turma mantém sempre a mesma cor, como os blocos de equipe do Teams. */
export function accentFor(id: string, archived = false): ClassroomAccent {
  if (archived) return ARCHIVED_ACCENT;

  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  return ACCENTS[hash % ACCENTS.length];
}

export function initialsOf(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Evita injeção de fórmula quando a planilha é aberta no Excel ou no Sheets.
function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** CSV com ";" e BOM, para abrir direto no Excel em português. */
export function buildStudentsCsv(students: ClassroomMember[]): string {
  const rows = [
    ["Nome", "E-mail", "Data de ingresso"],
    ...students.map((student) => [
      student.name,
      student.email,
      formatDate(student.joinedAt),
    ]),
  ];

  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/csv;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export function fileSlug(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "turma"
  );
}
