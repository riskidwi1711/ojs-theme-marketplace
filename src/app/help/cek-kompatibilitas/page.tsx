import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Cek Kompatibilitas Tema OJS",
  description: "Cara memastikan tema OJS yang Anda pilih kompatibel dengan versi OJS yang digunakan di jurnal Anda.",
  keywords: ["kompatibilitas tema OJS", "cek versi OJS", "OJS theme compatibility check"],
  alternates: { canonical: "/help/cek-kompatibilitas" },
  openGraph: {
    title: "Cek Kompatibilitas Tema OJS | Open Themes",
    description: "Cara memastikan tema OJS kompatibel dengan versi OJS Anda.",
    url: "/help/cek-kompatibilitas",
  },
};

export default function CekKompatibilitasPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Cek Kompatibilitas</h1>
          <p className="text-white/60">Cara memastikan tema cocok dengan versi OJS Anda.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto space-y-10">
        {/* Check OJS version */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Cara Mengetahui Versi OJS Anda</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3"><span className="font-bold text-[#1c3a6e] flex-shrink-0">1.</span>Login ke panel admin OJS Anda.</li>
            <li className="flex gap-3"><span className="font-bold text-[#1c3a6e] flex-shrink-0">2.</span>Klik menu <strong>Administration</strong> di sidebar kiri.</li>
            <li className="flex gap-3"><span className="font-bold text-[#1c3a6e] flex-shrink-0">3.</span>Pilih <strong>System Information</strong>.</li>
            <li className="flex gap-3"><span className="font-bold text-[#1c3a6e] flex-shrink-0">4.</span>Versi OJS tertera di bagian atas halaman, contoh: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">3.3.0-16</code> atau <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">3.4.0-7</code>.</li>
          </ol>
        </div>

        {/* Compatibility table */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Tabel Kompatibilitas Umum</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Label Tema</th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Versi OJS yang Didukung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { label: "OJS 3.4", versions: "3.4.0-x" },
                  { label: "OJS 3.3", versions: "3.3.0-x" },
                  { label: "OJS 3.x", versions: "3.3.0-x dan 3.4.0-x" },
                  { label: "OJS 3.2 (Legacy)", versions: "3.2.0-x – 3.2.1-x" },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-3 font-medium text-[#1a1a2e]">{row.label}</td>
                    <td className="px-5 py-3 text-gray-500 font-mono text-xs">{row.versions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">* Selalu cek halaman produk masing-masing tema untuk konfirmasi versi yang didukung.</p>
        </div>

        <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200">
          <p className="font-semibold text-yellow-800 mb-1">⚠️ Perhatian</p>
          <p className="text-sm text-yellow-700">Menginstal tema yang tidak kompatibel dapat menyebabkan tampilan journal rusak. Selalu backup database dan file sebelum menginstal tema baru.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
