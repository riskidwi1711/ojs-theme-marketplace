import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Pasang Iklan",
  description: "Iklankan produk Anda di Open Themes dan jangkau ribuan akademisi, peneliti, dan pengelola jurnal ilmiah Indonesia.",
  keywords: ["iklan Open Themes", "advertise OJS marketplace", "pasang iklan jurnal akademik"],
  alternates: { canonical: "/pasang-iklan" },
  openGraph: {
    title: "Pasang Iklan | Open Themes",
    description: "Jangkau ribuan akademisi dan pengelola jurnal ilmiah Indonesia.",
    url: "/pasang-iklan",
  },
};

const packages = [
  {
    name: "Banner Homepage",
    price: "Rp 500.000 / bulan",
    desc: "Banner 728×90 di area atas homepage, terlihat oleh semua pengunjung.",
    specs: ["Format: JPG, PNG, GIF, WebP", "Ukuran: 728×90 px", "Maks. 200KB", "Link ke URL tujuan"],
  },
  {
    name: "Featured Listing",
    price: "Rp 350.000 / bulan",
    desc: "Produk/layanan Anda ditampilkan di seksi 'Featured' halaman tema.",
    specs: ["Logo 200×200 px", "Judul (maks. 50 karakter)", "Deskripsi singkat", "Link ke URL tujuan"],
  },
  {
    name: "Newsletter Sponsorship",
    price: "Rp 250.000 / pengiriman",
    desc: "Pesan sponsor Anda dikirimkan ke seluruh subscriber newsletter kami.",
    specs: ["Konten teks + 1 gambar", "Maks. 150 kata", "1 CTA button", "Jadwal sesuai kesepakatan"],
  },
];

export default function PasangIklanPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Pasang Iklan</p>
          <h1 className="text-4xl font-bold mb-4">Iklankan Produk Anda di Open Themes</h1>
          <p className="text-white/60">Jangkau ribuan akademisi, peneliti, dan pengelola jurnal ilmiah Indonesia.</p>
        </div>
      </section>

      {/* Audience stats */}
      <section className="bg-gray-50 py-12">
        <div className="container-page">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-3xl mx-auto">
            {[
              { value: "10K+", label: "Pengunjung/bulan" },
              { value: "500+", label: "Journal aktif" },
              { value: "5K+", label: "Subscriber newsletter" },
              { value: "80%", label: "Audience akademik" },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-2xl font-black text-[#1c3a6e]">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="container-page py-16">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Paket Iklan</h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {packages.map((pkg) => (
            <div key={pkg.name} className="rounded-2xl border border-gray-200 p-6 hover:border-[#1c3a6e]/30 hover:shadow-md transition-all">
              <h3 className="font-bold text-[#1a1a2e] mb-1">{pkg.name}</h3>
              <p className="text-[#3d8c1e] font-bold text-lg mb-3">{pkg.price}</p>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{pkg.desc}</p>
              <ul className="space-y-1.5">
                {pkg.specs.map((s) => (
                  <li key={s} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-[#3d8c1e]">·</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-2xl bg-[#1c3a6e]/5 border border-[#1c3a6e]/10 max-w-lg mx-auto text-center">
          <h3 className="font-bold text-[#1a1a2e] mb-2">Tertarik Beriklan?</h3>
          <p className="text-sm text-gray-500 mb-5">Hubungi tim bisnis kami untuk informasi lebih lanjut dan negosiasi paket custom.</p>
          <a href="mailto:ads@openthemes.id" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] text-white font-semibold text-sm hover:opacity-90 transition">
            ads@openthemes.id
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
