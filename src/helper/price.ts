import { Product } from "@/types";

export const parsePrice = (priceText: string | number) => {
  priceText = priceText.toString();
  let priceIDR = 0;
  if (priceText) {
    const match = priceText.match(/[\d.]+/);
    if (match) priceIDR = parseInt(match[0].replace(/\./g, ""), 10);
  }

  return priceIDR;
};

export function parsePriceIDR(p: Product): number {
  if (typeof p.price === "number") return p.price;
  if (p.priceText) {
    const match = p.priceText.match(/[\d,]+/);
    if (match) return parseInt(match[0].replace(/,/g, ""), 10);
  }
  return 0;
}
