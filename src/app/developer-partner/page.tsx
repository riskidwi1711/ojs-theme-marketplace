import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Developer Partner",
  description: "Program eksklusif Developer Partner Open Themes. Komisi hingga 70%, featured placement, dan dukungan co-marketing untuk developer tema OJS.",
  keywords: ["developer OJS theme", "jual tema OJS", "partner Open Themes", "seller tema jurnal"],
  alternates: { canonical: "/developer-partner" },
  openGraph: {
    title: "Developer Partner | Open Themes",
    description: "Program eksklusif untuk developer tema OJS berpengalaman. Komisi hingga 70%.",
    url: "/developer-partner",
  },
};

const tiers = [
  {
    name: "Partner Standar",
    features: ["Akses dashboard seller", "Komisi 65%", "Support prioritas", "Badge 'Verified Developer'"],
    req: "Min. 2 tema terpublikasi",
  },
  {
    name: "Partner Premium",
    features: ["Semua fitur Standar", "Komisi 70%", "Featured placement di homepage", "Co-marketing dengan Open Themes", "Dedicated account manager"],
    req: "Min. 5 tema & rating rata-rata 4.5+",
    highlight: true,
  },
];

export default function DeveloperPartnerPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Developer Partner</p>
          <h1 className="text-4xl font-bold mb-4">Jadilah Developer Partner Open Themes</h1>
          <p className="text-white/60">Program eksklusif untuk developer tema OJS berpengalaman yang ingin berkembang bersama kami.</p>
        </div>
      </section>

      <section className="container-page py-16 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Tingkatan Partner</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {tiers.map((tier) => (
            <div key={tier.name} className={`rounded-2xl p-6 border-2 ${tier.highlight ? "border-[#3d8c1e] bg-[#3d8c1e]/5" : "border-gray-200"}`}>
              {tier.highlight && <span className="text-xs font-bold text-[#3d8c1e] uppercase tracking-wide">Recommended</span>}
              <h3 className="font-bold text-[#1a1a2e] text-xl mt-1 mb-1">{tier.name}</h3>
              <p className="text-xs text-gray-400 mb-4">{tier.req}</p>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-[#3d8c1e]">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Tertarik menjadi Partner?</h3>
          <p className="text-white/60 text-sm mb-6">Mulailah dengan mendaftar sebagai seller, publikasikan tema Anda, dan status partner akan dievaluasi secara berkala.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/jual-tema" className="px-5 py-2.5 rounded-xl bg-[#3d8c1e] text-white text-sm font-semibold hover:bg-[#317318] transition">
              Mulai Jual Tema
            </a>
            <a href="/kontak" className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition">
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
