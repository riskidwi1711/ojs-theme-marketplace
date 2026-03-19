import http from "@/api/adminHttp";

export async function adminUploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await http.post("/api/v1/admin/uploads", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const url = res.data?.url ?? res.data?.data?.url ?? res.data?.data;
  if (!url || typeof url !== "string") throw new Error("Upload gagal: URL tidak diterima");
  return url;
}
