import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plugin OJS",
  description: "Temukan plugin tambahan untuk memperluas fungsionalitas Open Journal Systems Anda. Plugin gratis dan premium untuk jurnal ilmiah.",
  keywords: ["plugin OJS", "OJS plugins", "ekstensi jurnal OJS", "add-on OJS", "plugin jurnal ilmiah"],
  alternates: { canonical: "/plugins" },
  openGraph: {
    title: "Plugin OJS | Open Themes",
    description: "Plugin tambahan untuk memperluas fungsionalitas OJS Anda.",
    url: "/plugins",
  },
};

export default function PluginsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
