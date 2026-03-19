export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  counts: { [rating: number]: number };
}
