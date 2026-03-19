import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Kontak Kami",
  description: "Hubungi tim Open Themes untuk pertanyaan seputar tema OJS, dukungan teknis, atau kerjasama. Kami siap membantu Anda.",
  alternates: { canonical: "/kontak" },
  openGraph: {
    title: "Kontak Kami | Open Themes",
    description: "Hubungi tim Open Themes untuk pertanyaan seputar tema OJS, dukungan teknis, atau kerjasama.",
    url: "/kontak",
    type: "website",
  },
};

export default function KontakPage() {
  const channels = [
    { label: "Email", value: "support@openthemes.id", desc: "Respons dalam 1×24 jam kerja" },
    { label: "WhatsApp", value: "+62 812-0000-0000", desc: "Senin–Jumat, 09.00–17.00 WIB" },
    { label: "Lokasi", value: "Jakarta, Indonesia", desc: "Kunjungan hanya dengan janji" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Kontak</p>
          <h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-white/60">Ada pertanyaan atau butuh bantuan? Tim kami siap membantu Anda.</p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Kirim Pesan</h2>
            <form className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nama</label>
                  <input type="text" placeholder="Nama lengkap" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d8c1e]/40 focus:border-[#3d8c1e] transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                  <input type="email" placeholder="email@contoh.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d8c1e]/40 focus:border-[#3d8c1e] transition" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Subjek</label>
                <input type="text" placeholder="Topik pesan Anda" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d8c1e]/40 focus:border-[#3d8c1e] transition" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Pesan</label>
                <textarea rows={5} placeholder="Tuliskan pesan Anda..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d8c1e]/40 focus:border-[#3d8c1e] transition resize-none" />
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] text-white font-semibold text-sm hover:opacity-90 transition">
                Kirim Pesan
              </button>
            </form>
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">Informasi Kontak</h2>
            <div className="space-y-4">
              {channels.map((c) => (
                <div key={c.label} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-[#1c3a6e]/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1c3a6e]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{c.label}</p>
                    <p className="font-semibold text-[#1a1a2e] mt-0.5">{c.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-2xl bg-[#3d8c1e]/8 border border-[#3d8c1e]/20">
              <p className="text-sm font-semibold text-[#3d8c1e] mb-1">Butuh bantuan teknis cepat?</p>
              <p className="text-sm text-gray-600">Kunjungi <a href="/help" className="text-[#3d8c1e] font-medium underline">Pusat Bantuan</a> kami untuk panduan langkah demi langkah, atau lihat <a href="/faq" className="text-[#3d8c1e] font-medium underline">FAQ</a> untuk jawaban atas pertanyaan umum.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
