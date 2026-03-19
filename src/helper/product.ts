import { Product } from "@/types";
import { allStaticProducts } from "@/data/products";

export function findProductByID(id: string): Product | undefined {
  return allStaticProducts.find((p) => p.id === id);
}
