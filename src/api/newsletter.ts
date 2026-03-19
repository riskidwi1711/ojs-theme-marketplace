import http from "@/api/http";
import type { NewsletterSubscribeResponse } from "@/types/newsletter";

export async function subscribeNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  const res = await http.post("/api/v1/newsletter", { email });
  return res.data;
}

const newsletter = { subscribeNewsletter };
export default newsletter;
