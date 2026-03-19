import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Tema OJS",
  description: "Jelajahi koleksi tema premium untuk jurnal OJS. Filter berdasarkan kategori, harga, dan kompatibilitas. Desain modern untuk jurnal ilmiah Indonesia.",
  keywords: ["tema OJS", "OJS theme", "template jurnal ilmiah", "tema jurnal OJS Indonesia"],
  alternates: { canonical: "/themes" },
  openGraph: {
    title: "Semua Tema OJS | Open Themes",
    description: "Jelajahi koleksi tema premium untuk jurnal OJS. Filter berdasarkan kategori, harga, dan kompatibilitas.",
    url: "/themes",
    type: "website",
  },
};

export default function ThemesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
