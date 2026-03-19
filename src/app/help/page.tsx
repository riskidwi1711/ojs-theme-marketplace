import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Pusat Bantuan",
  description: "Temukan panduan, tutorial, dan jawaban atas pertanyaan seputar pembelian, instalasi, dan penggunaan tema OJS di Open Themes.",
  keywords: ["bantuan OJS", "help center OJS", "panduan tema OJS", "tutorial instalasi OJS"],
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Pusat Bantuan | Open Themes",
    description: "Temukan panduan dan jawaban atas pertanyaan seputar tema OJS.",
    url: "/help",
  },
};

const helpTopics = [
  { title: "Cara Pembelian", desc: "Panduan lengkap proses pembelian tema dari awal hingga selesai.", href: "/help/cara-pembelian", icon: "🛒" },
  { title: "Cara Instalasi", desc: "Langkah-langkah instalasi tema OJS di server Anda.", href: "/help/cara-instalasi", icon: "⚙️" },
  { title: "Pengembalian Dana", desc: "Prosedur dan syarat pengajuan refund pembelian.", href: "/help/pengembalian-dana", icon: "💰" },
  { title: "Cek Kompatibilitas", desc: "Cara memastikan tema kompatibel dengan versi OJS Anda.", href: "/help/cek-kompatibilitas", icon: "✅" },
  { title: "Live Preview", desc: "Cara menggunakan fitur pratinjau langsung sebelum membeli.", href: "/help/live-preview", icon: "👁️" },
  { title: "Lisensi Tema", desc: "Penjelasan jenis lisensi dan hak penggunaan tema.", href: "/help/lisensi-tema", icon: "📄" },
  { title: "Masalah Lainnya", desc: "Solusi untuk masalah teknis dan pertanyaan umum lainnya.", href: "/help/masalah-lainnya", icon: "🔧" },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Pusat Bantuan</p>
          <h1 className="text-4xl font-bold mb-4">Bagaimana kami bisa membantu?</h1>
          <p className="text-white/60 mb-8">Temukan panduan, tutorial, dan jawaban atas pertanyaan Anda.</p>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Cari artikel bantuan..."
              className="w-full px-5 py-3.5 rounded-xl text-gray-900 text-sm outline-none pr-12 shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#3d8c1e] flex items-center justify-center text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="container-page py-16">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Topik Bantuan</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {helpTopics.map((topic) => (
            <a
              key={topic.href}
              href={topic.href}
              className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-[#3d8c1e]/30 hover:shadow-md transition-all group"
            >
              <span className="text-2xl flex-shrink-0">{topic.icon}</span>
              <div>
                <p className="font-semibold text-[#1a1a2e] group-hover:text-[#3d8c1e] transition-colors">{topic.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{topic.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 py-14">
        <div className="container-page text-center max-w-lg mx-auto">
          <p className="font-bold text-[#1a1a2e] text-lg mb-2">Masih butuh bantuan?</p>
          <p className="text-sm text-gray-500 mb-6">Tim support kami siap membantu Senin–Jumat, 09.00–17.00 WIB.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/kontak" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] text-white text-sm font-semibold hover:opacity-90 transition">
              Hubungi Support
            </a>
            <a href="/faq" className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition">
              Lihat FAQ
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
