import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Lisensi Tema OJS",
  description: "Penjelasan lengkap jenis lisensi dan hak penggunaan tema OJS yang dibeli di Open Themes.",
  keywords: ["lisensi tema OJS", "hak penggunaan tema jurnal", "OJS theme license"],
  alternates: { canonical: "/help/lisensi-tema" },
  openGraph: {
    title: "Lisensi Tema OJS | Open Themes",
    description: "Penjelasan lengkap jenis lisensi dan hak penggunaan tema OJS.",
    url: "/help/lisensi-tema",
  },
};

const licenses = [
  {
    name: "Lisensi Reguler",
    price: "Sesuai harga produk",
    features: ["1 domain / instalasi OJS", "Update gratis 6 bulan", "Modifikasi untuk kebutuhan sendiri", "Support teknis 3 bulan"],
    notIncluded: ["Tidak boleh dijual kembali", "Tidak untuk beberapa domain"],
    color: "border-gray-200",
  },
  {
    name: "Lisensi Extended",
    price: "Harga produk × 2",
    features: ["Hingga 3 domain / instalasi OJS", "Update gratis 12 bulan", "Modifikasi untuk kebutuhan sendiri", "Support teknis prioritas 6 bulan"],
    notIncluded: ["Tidak boleh dijual kembali"],
    color: "border-[#3d8c1e]",
    highlight: true,
  },
];

export default function LisensiTemaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Lisensi Tema</h1>
          <p className="text-white/60">Penjelasan hak penggunaan dan jenis lisensi.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto space-y-10">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Jenis Lisensi</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {licenses.map((lic) => (
              <div key={lic.name} className={`rounded-2xl border-2 p-5 ${lic.color} ${lic.highlight ? "bg-[#3d8c1e]/5" : ""}`}>
                {lic.highlight && <span className="text-xs font-bold text-[#3d8c1e] uppercase tracking-wide">Populer</span>}
                <h3 className="font-bold text-[#1a1a2e] text-lg mt-1">{lic.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{lic.price}</p>
                <ul className="space-y-2">
                  {lic.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-gray-600">
                      <span className="text-[#3d8c1e] flex-shrink-0">✓</span>{f}
                    </li>
                  ))}
                  {lic.notIncluded.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-gray-400">
                      <span className="flex-shrink-0">✕</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Yang Diperbolehkan</h2>
          <div className="space-y-2">
            {[
              "Menginstal dan menggunakan tema pada domain yang dilisensikan",
              "Memodifikasi kode CSS, template, dan aset tema untuk kebutuhan journal",
              "Menggunakan tema untuk journal komersial maupun non-komersial",
            ].map((item) => (
              <div key={item} className="flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-gray-700">
                <span className="text-green-500 flex-shrink-0">✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Yang Tidak Diperbolehkan</h2>
          <div className="space-y-2">
            {[
              "Mendistribusikan, menjual, atau membagikan tema kepada pihak lain",
              "Mengklaim tema sebagai karya asli Anda",
              "Menggunakan tema melebihi jumlah domain yang dilisensikan",
            ].map((item) => (
              <div key={item} className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-gray-700">
                <span className="text-red-400 flex-shrink-0">✕</span>{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
