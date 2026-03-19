import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/cart";
import { AuthProvider } from "@/context/auth";
import { WishlistProvider } from "@/context/wishlist";
import { ToastProvider } from "@/components/ui/toast";
import HelpCenterChat from "@/components/layout/HelpCenterChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://openthemes.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Open Themes – Marketplace Tema OJS Indonesia",
    template: "%s | Open Themes",
  },
  description: "Temukan tema premium untuk jurnal OJS. Kompatibel OJS 3.x, support resmi, update gratis 1 tahun.",
  keywords: ["tema OJS", "OJS theme", "marketplace OJS", "jurnal ilmiah", "Open Journal Systems", "template jurnal", "OJS Indonesia"],
  authors: [{ name: "Open Themes" }],
  creator: "Open Themes",
  publisher: "Open Themes",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Open Themes",
    title: "Open Themes – Marketplace Tema OJS Indonesia",
    description: "Temukan tema premium untuk jurnal OJS. Kompatibel OJS 3.x, support resmi, update gratis 1 tahun.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Themes – Marketplace Tema OJS Indonesia",
    description: "Temukan tema premium untuk jurnal OJS. Kompatibel OJS 3.x, support resmi, update gratis 1 tahun.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ToastProvider>
                {children}
                <HelpCenterChat />
              </ToastProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
