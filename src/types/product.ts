export interface Product {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number;
  original?: number;
  priceText?: string; // For scraped items like "Rp2.500.000"
  rating?: number;
  reviews?: number;
  image?: string;     // URL for image
  emoji?: string;     // Emoji fallback
  bg?: string;        // Tailwind class for background (used with emoji)
  tags?: string[];
  badge?: string;     // "New", "Sale"
  badgeColor?: string; // Tailwind class for badge bg
  compat?: string;    // "OJS 3.3+"
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  original?: number;
  rating?: number;
  reviews?: number;
  compat?: string;
  category?: string;
  section?: string;
  emoji?: string;
  bg?: string;
  badge?: string;
  badgeColor?: string;
  // Detail fields
  image?: string;
  screenshots?: string[]; // sent to backend
  gallery?: string[];     // returned from backend (same as screenshots)
  description?: string;
  features?: string[];
  demoUrl?: string;
  livePreviewUrl?: string;
  // Technical specs
  ojsVersion?: string;
  framework?: string;
  browserSupport?: string;
  license?: string;
  updateDuration?: string;
  supportDuration?: string;
  tags?: string[];
  changelog?: { version: string; date: string; tag: string; changes: string[] }[];
}
