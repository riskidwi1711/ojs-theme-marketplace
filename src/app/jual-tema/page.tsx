import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Jual Tema OJS",
  description: "Monetisasi keahlian desain Anda dengan menjual tema OJS di Open Themes. Komisi hingga 70% per penjualan.",
  keywords: ["jual tema OJS", "seller tema jurnal", "monetisasi desain OJS", "buat tema OJS"],
  alternates: { canonical: "/jual-tema" },
  openGraph: {
    title: "Jual Tema OJS | Open Themes",
    description: "Monetisasi keahlian desain Anda. Komisi hingga 70% per penjualan.",
    url: "/jual-tema",
  },
};

const steps = [
  { n: "01", t: "Daftar sebagai Seller", d: "Buat akun dan ajukan permohonan menjadi seller melalui formulir di bawah. Tim kami akan meninjau aplikasi dalam 2–3 hari kerja." },
  { n: "02", t: "Submit Tema", d: "Upload tema beserta dokumentasi, tangkapan layar, dan informasi kompatibilitas melalui dashboard seller." },
  { n: "03", t: "Review & Approval", d: "Tim kurasi kami menguji tema selama 3–5 hari kerja. Anda akan mendapatkan notifikasi hasil review beserta feedback jika diperlukan." },
  { n: "04", t: "Go Live & Earn", d: "Tema Anda dipublikasikan dan mulai menghasilkan. Komisi dibayarkan setiap bulan ke rekening bank Anda." },
];

const benefits = [
  { label: "Komisi hingga 70%", desc: "Seller mendapatkan 70% dari setiap penjualan tema." },
  { label: "Pasar Luas", desc: "Jangkau ribuan journal akademik di seluruh Indonesia." },
  { label: "Dashboard Lengkap", desc: "Pantau penjualan, pendapatan, dan review secara real-time." },
  { label: "Pembayaran Rutin", desc: "Komisi dibayarkan setiap tanggal 15 bulan berikutnya." },
];

export default function JualTemaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Jual Tema</p>
          <h1 className="text-4xl font-bold mb-4">Jual Tema OJS Anda di Open Themes</h1>
          <p className="text-white/60 mb-8">Monetisasi keahlian desain Anda dan raih komisi hingga 70% dari setiap penjualan.</p>
          <a href="#daftar" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3d8c1e] text-white font-semibold hover:bg-[#317318] transition">
            Mulai Jual Sekarang →
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-14">
        <div className="container-page">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Keuntungan Berjualan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-[#3d8c1e]/10 flex items-center justify-center mx-auto mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#3d8c1e]" />
                </div>
                <p className="font-bold text-[#1a1a2e]">{b.label}</p>
                <p className="text-xs text-gray-500 mt-1">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container-page py-14 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Cara Mulai Berjualan</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="p-5 rounded-2xl border border-gray-100">
              <span className="text-3xl font-black text-[#1c3a6e]/20">{s.n}</span>
              <h3 className="font-bold text-[#1a1a2e] mt-2 mb-1">{s.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Form */}
      <section id="daftar" className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] py-16">
        <div className="container-page max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Daftar sebagai Seller</h2>
          <p className="text-white/50 text-sm mb-8">Isi formulir dan tim kami akan menghubungi Anda.</p>
          <form className="space-y-3 text-left">
            <input type="text" placeholder="Nama / Nama Studio" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#3d8c1e] transition" />
            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#3d8c1e] transition" />
            <input type="url" placeholder="Link portofolio / contoh tema (opsional)" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#3d8c1e] transition" />
            <button type="submit" className="w-full py-3 rounded-xl bg-[#3d8c1e] text-white font-semibold text-sm hover:bg-[#317318] transition">
              Kirim Permohonan
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
