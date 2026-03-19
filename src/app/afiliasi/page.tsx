import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Program Afiliasi",
  description: "Bergabung dengan program afiliasi Open Themes. Dapatkan komisi 15% untuk setiap pembelian tema dari referral link Anda.",
  keywords: ["afiliasi OJS theme", "program afiliasi Open Themes", "komisi referral tema jurnal"],
  alternates: { canonical: "/afiliasi" },
  openGraph: {
    title: "Program Afiliasi | Open Themes",
    description: "Dapatkan komisi 15% untuk setiap pembelian tema dari referral link Anda.",
    url: "/afiliasi",
  },
};

export default function AfiliasIPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Program Afiliasi</p>
          <h1 className="text-4xl font-bold mb-4">Hasilkan Komisi dengan Merekomendasikan Tema</h1>
          <p className="text-white/60">Dapatkan komisi 15% untuk setiap pembelian yang berasal dari referral link Anda.</p>
        </div>
      </section>

      <section className="container-page py-16">
        {/* How it works */}
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Cara Kerja Program Afiliasi</h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
          {[
            { n: "1", t: "Daftar Gratis", d: "Buat akun dan aktifkan program afiliasi di dashboard. Dapatkan link referral unik Anda." },
            { n: "2", t: "Bagikan Link", d: "Bagikan link ke komunitas akademik, media sosial, atau blog Anda." },
            { n: "3", t: "Dapatkan Komisi", d: "Komisi 15% untuk setiap pembelian valid dari link Anda, dibayarkan setiap bulan." },
          ].map((item) => (
            <div key={item.n} className="text-center p-6 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3a6e] to-[#3d8c1e] text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {item.n}
              </div>
              <h3 className="font-bold text-[#1a1a2e] mb-2">{item.t}</h3>
              <p className="text-sm text-gray-500">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mb-16">
          {[
            { value: "15%", label: "Komisi per penjualan" },
            { value: "30 hari", label: "Masa berlaku cookie" },
            { value: "Rp 200rb", label: "Minimum pencairan" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
              <p className="text-3xl font-black text-[#1c3a6e]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-gradient-to-br from-[#1c3a6e]/5 to-[#3d8c1e]/5 border border-[#1c3a6e]/10">
          <h3 className="font-bold text-[#1a1a2e] text-lg mb-2">Mulai Sekarang</h3>
          <p className="text-sm text-gray-500 mb-5">Program afiliasi tersedia untuk semua pengguna terdaftar.</p>
          <a href="/auth/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] text-white font-semibold text-sm hover:opacity-90 transition">
            Login & Aktifkan Afiliasi
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
