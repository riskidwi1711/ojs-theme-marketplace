import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Open Themes – Marketplace Tema OJS Indonesia",
    short_name: "Open Themes",
    description: "Temukan tema premium untuk jurnal OJS. Kompatibel OJS 3.x.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1c3a6e",
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
    ],
  };
}
