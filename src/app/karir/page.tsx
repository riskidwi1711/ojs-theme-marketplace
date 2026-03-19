import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Karir",
  description: "Bergabung dengan tim Open Themes dan bantu kami membangun ekosistem jurnal akademik Indonesia. Posisi remote-friendly.",
  keywords: ["karir Open Themes", "lowongan kerja remote", "kerja startup Indonesia", "loker OJS developer"],
  alternates: { canonical: "/karir" },
  openGraph: {
    title: "Karir | Open Themes",
    description: "Bergabung dengan tim Open Themes. Posisi remote-friendly dan lingkungan kolaboratif.",
    url: "/karir",
  },
};

const openings = [
  { title: "Frontend Developer (React/Next.js)", type: "Full-time", location: "Remote", dept: "Engineering" },
  { title: "OJS Theme Designer", type: "Freelance", location: "Remote", dept: "Design" },
  { title: "Customer Support Specialist", type: "Full-time", location: "Jakarta / Remote", dept: "Support" },
  { title: "Content & SEO Writer", type: "Part-time", location: "Remote", dept: "Marketing" },
];

const perks = [
  { label: "Remote Friendly", desc: "Bekerja dari mana saja di seluruh Indonesia." },
  { label: "Gaji Kompetitif", desc: "Kompensasi di atas rata-rata industri." },
  { label: "Tunjangan Belajar", desc: "Budget untuk kursus dan konferensi." },
  { label: "Lingkungan Kolaboratif", desc: "Tim kecil yang solid dan saling mendukung." },
];

export default function KarirPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Karir</p>
          <h1 className="text-4xl font-bold mb-4">Bergabung dengan Tim Kami</h1>
          <p className="text-white/60">Bantu kami membangun ekosistem jurnal akademik Indonesia yang lebih baik.</p>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-gray-50 py-14">
        <div className="container-page">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-8 text-center">Mengapa Bergabung?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((p) => (
              <div key={p.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#3d8c1e]/10 flex items-center justify-center mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3d8c1e]" />
                </div>
                <p className="font-bold text-[#1a1a2e] text-sm mb-1">{p.label}</p>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="container-page py-16">
        <h2 className="text-xl font-bold text-[#1a1a2e] mb-8">Posisi Terbuka</h2>
        <div className="space-y-3">
          {openings.map((job) => (
            <div key={job.title} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-[#3d8c1e]/30 hover:bg-[#3d8c1e]/5 transition-colors group">
              <div>
                <p className="font-semibold text-[#1a1a2e] group-hover:text-[#3d8c1e] transition-colors">{job.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-gray-400">{job.dept}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="text-xs text-gray-400">{job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1c3a6e]/10 text-[#1c3a6e]">{job.type}</span>
                <a href={`mailto:karir@openthemes.id?subject=Lamaran: ${job.title}`} className="text-sm font-semibold text-[#3d8c1e] hover:underline">
                  Lamar →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
          <p className="font-semibold text-[#1a1a2e] mb-1">Tidak ada posisi yang cocok?</p>
          <p className="text-sm text-gray-500 mb-3">Kirim CV dan portofolio Anda. Kami selalu mencari orang-orang berbakat.</p>
          <a href="mailto:karir@openthemes.id" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1c3a6e] text-white text-sm font-semibold hover:bg-[#162f5a] transition">
            Kirim Lamaran Terbuka
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
