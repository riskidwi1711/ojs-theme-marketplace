import http from "@/api/http";
import type { Review, ReviewSummary } from "@/types/review";

export async function listReviews(productId: string): Promise<ReviewSummary> {
  const res = await http.get(`/api/v1/products/${encodeURIComponent(productId)}/reviews`);
  return {
    average: res.data?.avg ?? 0,
    total: res.data?.total ?? 0,
    counts: res.data?.dist ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
}

export async function createReview(
  productId: string,
  data: { rating: number; body: string }
): Promise<Review> {
  const res = await http.post(`/api/v1/products/${encodeURIComponent(productId)}/reviews`, data);
  return res.data?.review;
}
