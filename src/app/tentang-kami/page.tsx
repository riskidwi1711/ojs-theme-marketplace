import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Open Themes adalah marketplace tema premium untuk jurnal OJS (Open Journal Systems) buatan Indonesia. Kami menyediakan solusi desain modern untuk jurnal ilmiah.",
  alternates: { canonical: "/tentang-kami" },
  openGraph: {
    title: "Tentang Kami | Open Themes",
    description: "Open Themes adalah marketplace tema premium untuk jurnal OJS buatan Indonesia.",
    url: "/tentang-kami",
    type: "website",
  },
};

export default function TentangKamiPage() {
  const values = [
    { title: "Kualitas Terjamin", desc: "Setiap tema dikurasi dan diuji secara menyeluruh sebelum dipublikasikan di marketplace kami." },
    { title: "Dukungan Lokal", desc: "Tim support kami berbahasa Indonesia dan siap membantu setiap langkah penggunaan tema." },
    { title: "Komunitas Akademik", desc: "Kami lahir dari komunitas akademik Indonesia dan memahami kebutuhan jurnal ilmiah." },
    { title: "Inovasi Berkelanjutan", desc: "Terus mengembangkan fitur dan koleksi tema mengikuti standar OJS terbaru." },
  ];

  const team = [
    { name: "Andi Pratama", role: "Founder & CEO" },
    { name: "Sari Dewi", role: "Lead Designer" },
    { name: "Budi Santoso", role: "Head of Engineering" },
    { name: "Rina Wulandari", role: "Customer Success" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Tentang Kami</p>
          <h1 className="text-4xl font-bold mb-4">Marketplace Tema OJS #1 di Indonesia</h1>
          <p className="text-white/60 leading-relaxed">
            Open Themes hadir untuk membantu institusi akademik Indonesia tampil profesional melalui tema OJS berkualitas tinggi, mudah dipasang, dan terjangkau.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-5">Kisah Kami</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          <p>
            Open Themes didirikan pada 2022 oleh sekelompok pengembang dan akademisi yang frustrasi dengan sulitnya menemukan tema OJS berkualitas dengan dukungan bahasa Indonesia. Kami melihat ratusan jurnal ilmiah Indonesia tampil dengan desain seadanya bukan karena tidak mau, tapi karena tidak tahu di mana mencarinya.
          </p>
          <p>
            Dari sebuah proyek sampingan kecil, Open Themes tumbuh menjadi marketplace terpercaya dengan ratusan tema premium, ribuan pengguna aktif, dan komunitas developer tema OJS yang terus berkembang.
          </p>
          <p>
            Hari ini kami melayani lebih dari 500 jurnal ilmiah dari berbagai universitas dan lembaga penelitian di seluruh Indonesia, dengan komitmen yang sama: menghadirkan tampilan profesional untuk jurnal akademik Indonesia.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-10 text-center">Nilai-Nilai Kami</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#3d8c1e]/10 flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#3d8c1e]" />
                </div>
                <h3 className="font-bold text-[#1a1a2e] mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-page py-16">
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-10 text-center">Tim Kami</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {team.map((t) => (
            <div key={t.name} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1c3a6e] to-[#3d8c1e] flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                {t.name[0]}
              </div>
              <p className="font-semibold text-[#1a1a2e]">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
