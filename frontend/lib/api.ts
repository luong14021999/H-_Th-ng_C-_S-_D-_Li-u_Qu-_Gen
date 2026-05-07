import { NguonGen } from "@/data/nguonGen";
import { ExtendedFormData } from "@/data/extendedTypes";

const BASE = "/api";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Nguồn gen ─────────────────────────────────────────────
export const apiGetAll = () => req<NguonGen[]>("/nguon-gen");

export const apiUpdate = (ma: string, body: Partial<NguonGen>) =>
  req<NguonGen>(`/nguon-gen/${ma}`, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = (ma: string) =>
  req<void>(`/nguon-gen/${ma}`, { method: "DELETE" });

// ── Forms ─────────────────────────────────────────────────
export const apiGetForms = (ma: string) =>
  req<ExtendedFormData>(`/nguon-gen/${ma}/forms`);

export const apiSaveForm = (
  ma: string,
  formKey: "form1" | "form2" | "form3" | "form4",
  data: object
) =>
  req(`/nguon-gen/${ma}/${formKey}`, { method: "PUT", body: JSON.stringify(data) });

// ── Images ────────────────────────────────────────────────
export const apiUploadImage = async (ma: string, file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/nguon-gen/${ma}/images`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(await res.text());
  const { url } = await res.json();
  return url as string;
};

export const apiDeleteImage = (ma: string, filename: string) =>
  req(`/nguon-gen/${ma}/images/${filename}`, { method: "DELETE" });

// ── Seed (chạy 1 lần) ────────────────────────────────────
export const apiSeed = (records: NguonGen[]) =>
  req<{ seeded: number; message?: string }>("/admin/seed", {
    method: "POST",
    body: JSON.stringify({ records }),
  });
