import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promo & Diskon Tema OJS",
  description: "Dapatkan tema OJS premium dengan harga spesial. Penawaran terbatas waktu untuk jurnal ilmiah Anda.",
  keywords: ["promo tema OJS", "diskon OJS theme", "harga spesial tema jurnal", "flash sale OJS"],
  alternates: { canonical: "/promos" },
  openGraph: {
    title: "Promo & Diskon Tema OJS | Open Themes",
    description: "Penawaran terbatas waktu untuk tema OJS premium.",
    url: "/promos",
  },
};

export default function PromosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
