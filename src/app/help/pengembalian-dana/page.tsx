import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Kebijakan Pengembalian Dana",
  description: "Prosedur dan syarat pengajuan refund pembelian tema OJS di Open Themes. Refund dalam 7 hari jika tema tidak berfungsi.",
  keywords: ["refund tema OJS", "pengembalian dana tema", "kebijakan refund Open Themes"],
  alternates: { canonical: "/help/pengembalian-dana" },
  openGraph: {
    title: "Kebijakan Pengembalian Dana | Open Themes",
    description: "Prosedur dan syarat pengajuan refund pembelian tema OJS di Open Themes.",
    url: "/help/pengembalian-dana",
  },
};

export default function PengembalianDanaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Pengembalian Dana</h1>
          <p className="text-white/60">Kebijakan dan prosedur pengajuan refund.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto space-y-10">
        {/* Eligible */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Kapan Refund Dapat Diajukan?</h2>
          <div className="space-y-3">
            {[
              "Tema tidak berfungsi sesuai deskripsi produk yang tertera.",
              "Terdapat bug kritis yang tidak dapat diselesaikan tim kami dalam 7 hari kerja.",
              "File tema rusak atau tidak dapat diunduh setelah pembayaran.",
              "Terjadi pembayaran ganda secara tidak sengaja.",
            ].map((item) => (
              <div key={item} className="flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Not eligible */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Kondisi yang Tidak Dapat Direfund</h2>
          <div className="space-y-3">
            {[
              "Tema sudah berhasil diinstal dan digunakan.",
              "Ketidakcocokan karena pengabaian informasi kompatibilitas yang tertera.",
              "Permintaan refund setelah melewati 7 hari sejak pembelian.",
              "Perubahan keputusan atau preferensi pribadi.",
            ].map((item) => (
              <div key={item} className="flex gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
                <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>
                <p className="text-sm text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Prosedur Pengajuan Refund</h2>
          <ol className="space-y-4">
            {[
              { n: "1", t: "Kirim Email Refund", d: "Kirim email ke refund@openthemes.id dengan subjek 'Permintaan Refund - [Order ID]'. Sertakan Order ID, email akun, dan penjelasan singkat alasan refund." },
              { n: "2", t: "Verifikasi Tim", d: "Tim kami akan memverifikasi permintaan dalam 1–2 hari kerja dan mungkin meminta informasi tambahan atau berusaha menyelesaikan masalah teknis terlebih dahulu." },
              { n: "3", t: "Proses Pengembalian Dana", d: "Jika refund disetujui, dana akan dikembalikan ke metode pembayaran asal dalam 3–7 hari kerja tergantung bank/provider pembayaran." },
            ].map((item) => (
              <li key={item.n} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-[#1c3a6e] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{item.n}</span>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{item.t}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{item.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-5 rounded-2xl bg-[#1c3a6e]/5 border border-[#1c3a6e]/10">
          <p className="font-semibold text-[#1a1a2e] mb-1">Pertanyaan tentang refund?</p>
          <p className="text-sm text-gray-600">Hubungi: <a href="mailto:refund@openthemes.id" className="text-[#3d8c1e] font-medium">refund@openthemes.id</a></p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
