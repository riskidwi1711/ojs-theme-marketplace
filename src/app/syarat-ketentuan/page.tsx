import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan layanan marketplace tema OJS Open Themes, lisensi produk, dan kebijakan pembayaran.",
  alternates: { canonical: "/syarat-ketentuan" },
  openGraph: {
    title: "Syarat & Ketentuan | Open Themes",
    description: "Syarat dan ketentuan penggunaan layanan Open Themes.",
    url: "/syarat-ketentuan",
  },
};

const sections = [
  {
    title: "1. Penerimaan Syarat",
    content: "Dengan mengakses dan menggunakan layanan Open Themes, Anda menyatakan telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini. Jika Anda tidak menyetujui, harap tidak menggunakan layanan kami.",
  },
  {
    title: "2. Akun Pengguna",
    content: `• Anda harus berusia minimal 17 tahun atau memiliki persetujuan orang tua/wali untuk menggunakan layanan ini.
• Anda bertanggung jawab menjaga kerahasiaan kredensial akun Anda.
• Setiap aktivitas yang terjadi melalui akun Anda adalah tanggung jawab Anda.
• Open Themes berhak menangguhkan atau menghapus akun yang melanggar ketentuan ini.`,
  },
  {
    title: "3. Lisensi Penggunaan Tema",
    content: `Dengan membeli tema, Anda mendapatkan lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan untuk:
• Menginstal dan menggunakan tema pada satu (1) domain/instalasi OJS
• Memodifikasi tema untuk kebutuhan journal Anda

Anda TIDAK diperkenankan untuk:
• Mendistribusikan, menjual, atau membagikan tema kepada pihak lain
• Menggunakan tema pada lebih dari satu domain tanpa lisensi tambahan
• Menghapus atribusi atau informasi hak cipta dari kode tema`,
  },
  {
    title: "4. Pembayaran dan Pengembalian Dana",
    content: `Semua harga dalam mata uang Rupiah (IDR) dan belum termasuk pajak yang berlaku. Pembayaran diproses secara aman melalui gateway pembayaran kami. Pengembalian dana dapat diminta dalam 7 hari jika tema tidak berfungsi sesuai deskripsi dan tim kami tidak dapat menyelesaikan masalah tersebut.`,
  },
  {
    title: "5. Kekayaan Intelektual",
    content: "Seluruh konten, desain, logo, dan materi di situs Open Themes adalah milik Open Themes atau pemberi lisensinya dan dilindungi oleh hukum hak cipta Indonesia. Tema-tema yang dijual di marketplace milik masing-masing developer dan dilisensikan kepada Anda sesuai ketentuan lisensi produk.",
  },
  {
    title: "6. Batasan Tanggung Jawab",
    content: "Open Themes tidak bertanggung jawab atas kerusakan tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami. Tanggung jawab kami dibatasi maksimal sebesar nilai pembelian terakhir Anda.",
  },
  {
    title: "7. Perubahan Layanan",
    content: "Open Themes berhak mengubah, menangguhkan, atau menghentikan layanan kapan saja. Kami akan berusaha memberikan pemberitahuan sebelumnya untuk perubahan signifikan.",
  },
  {
    title: "8. Hukum yang Berlaku",
    content: "Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia. Setiap sengketa diselesaikan melalui musyawarah mufakat atau, jika tidak tercapai, melalui pengadilan yang berwenang di Jakarta.",
  },
];

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Legal</p>
          <h1 className="text-4xl font-bold mb-4">Syarat & Ketentuan</h1>
          <p className="text-white/60">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </section>

      <section className="container-page py-16 max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-10 text-sm text-yellow-800 leading-relaxed">
          <strong>Penting:</strong> Harap baca Syarat & Ketentuan ini dengan seksama sebelum menggunakan layanan Open Themes. Penggunaan layanan kami berarti Anda menyetujui ketentuan di bawah ini.
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-3">{s.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-gray-100 text-sm text-gray-500">
          Pertanyaan tentang syarat & ketentuan kami? Hubungi: <a href="mailto:legal@openthemes.id" className="text-[#3d8c1e] font-medium">legal@openthemes.id</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
