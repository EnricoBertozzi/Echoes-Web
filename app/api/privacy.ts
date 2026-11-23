import { api } from "./axios";

export async function exportMyData(): Promise<void> {
  const response = await api.get<Blob>("/api/v1/users/me/export", {
    responseType: "blob",
  });

  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = "meus-dados-echoes.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
