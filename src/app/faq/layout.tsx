import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ – Pertanyaan Umum",
  description: "Temukan jawaban atas pertanyaan umum seputar pembelian tema OJS, lisensi, dukungan teknis, dan cara instalasi di Open Themes.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ – Pertanyaan Umum | Open Themes",
    description: "Jawaban atas pertanyaan umum seputar pembelian tema OJS, lisensi, dan dukungan teknis.",
    url: "/faq",
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
