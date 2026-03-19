import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const sitemapGroups = [
  {
    title: "Utama",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Semua Tema", href: "/themes" },
      { label: "Plugin OJS", href: "/plugins" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Kategori Tema",
    links: [
      { label: "Tema OJS 3.x", href: "/themes/ojs-3x" },
      { label: "Tema OJS 3.4", href: "/themes/ojs-34" },
      { label: "Tema Gratis", href: "/themes/free" },
      { label: "Best Sellers", href: "/themes/best-sellers" },
      { label: "New Arrivals", href: "/themes/new-arrivals" },
    ],
  },
  {
    title: "Akun",
    links: [
      { label: "Login", href: "/auth/login" },
      { label: "Daftar", href: "/auth/register" },
      { label: "Dashboard Akun", href: "/account" },
      { label: "Keranjang", href: "/cart" },
    ],
  },
  {
    title: "Informasi",
    links: [
      { label: "Tentang Kami", href: "/tentang-kami" },
      { label: "Kontak", href: "/kontak" },
      { label: "FAQ", href: "/faq" },
      { label: "Karir", href: "/karir" },
    ],
  },
  {
    title: "Pusat Bantuan",
    links: [
      { label: "Cara Pembelian", href: "/help/cara-pembelian" },
      { label: "Cara Instalasi", href: "/help/cara-instalasi" },
      { label: "Pengembalian Dana", href: "/help/pengembalian-dana" },
      { label: "Cek Kompatibilitas", href: "/help/cek-kompatibilitas" },
      { label: "Live Preview", href: "/help/live-preview" },
      { label: "Lisensi Tema", href: "/help/lisensi-tema" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    ],
  },
  {
    title: "Bisnis",
    links: [
      { label: "Jual Tema", href: "/jual-tema" },
      { label: "Program Afiliasi", href: "/afiliasi" },
      { label: "Developer Partner", href: "/developer-partner" },
      { label: "Pasang Iklan", href: "/pasang-iklan" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-3">Sitemap</p>
          <h1 className="text-3xl font-bold">Peta Situs</h1>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sitemapGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#3d8c1e] mb-4">{group.title}</h2>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-[#1c3a6e] hover:underline transition-colors flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
