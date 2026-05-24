import { NguonGen } from "@/data/nguonGen";
import { ExtendedFormData } from "@/data/extendedTypes";

const BASE = "/api";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    let msg: string;
    try {
      const json = JSON.parse(text);
      msg = json.error ?? json.message ?? text;
    } catch {
      msg = text || res.statusText;
    }
    throw new Error(`[${res.status}] ${path}: ${msg}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Nguồn gen ─────────────────────────────────────────────
export const apiGetAll = () => req<NguonGen[]>("/nguon-gen");

export const apiCreate = (body: Partial<NguonGen>) =>
  req<NguonGen>("/nguon-gen", { method: "POST", body: JSON.stringify(body) });

export const apiUpdate = (ma: string, body: Partial<NguonGen>) =>
  req<NguonGen>(`/nguon-gen/${ma}`, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = (ma: string) =>
  ma
    ? req<void>(`/nguon-gen/${ma}`, { method: "DELETE" })
    : req<void>(`/nguon-gen?ma=`, { method: "DELETE" });

// ── Forms ─────────────────────────────────────────────────
export const apiGetForms = (ma: string) =>
  req<ExtendedFormData>(`/nguon-gen/${ma}/forms`);

export const apiSaveForm = (
  ma: string,
  formKey: "form1" | "form2" | "form3" | "form4",
  data: object
) => {
  if (!ma) return Promise.reject(new Error("Mã nguồn gen không được trống"));
  return req(`/nguon-gen/${ma}/${formKey}`, { method: "PUT", body: JSON.stringify(data) });
};

// ── Images ────────────────────────────────────────────────
// Uploads go straight from the browser to Supabase Storage so they bypass the
// Vercel serverless 4.5MB body limit and our own server-side cap. Auth is
// enforced by storage RLS policies (only `authenticated` can INSERT/DELETE).
import { supabase } from "./supabase-browser";

const BUCKET = "nguon-gen-images";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export const apiUploadImage = async (ma: string, file: File): Promise<string> => {
  if (!/^[A-Za-z0-9._-]+$/.test(ma)) throw new Error("Mã không hợp lệ");
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Định dạng ảnh không hỗ trợ");

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
  const path = `${ma}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
};

export const apiDeleteImage = async (ma: string, filename: string): Promise<void> => {
  const { error } = await supabase.storage.from(BUCKET).remove([`${ma}/${filename}`]);
  if (error) throw new Error(error.message);
};


// ── Seed (chạy 1 lần) ────────────────────────────────────
export const apiSeed = (records: NguonGen[]) =>
  req<{ seeded: number; message?: string }>("/admin/seed", {
    method: "POST",
    body: JSON.stringify({ records }),
  });
