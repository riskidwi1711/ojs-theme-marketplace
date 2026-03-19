import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi Open Themes menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi pengguna.",
  alternates: { canonical: "/kebijakan-privasi" },
  openGraph: {
    title: "Kebijakan Privasi | Open Themes",
    description: "Cara Open Themes mengumpulkan, menggunakan, dan melindungi data pribadi pengguna.",
    url: "/kebijakan-privasi",
  },
};

const sections = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    content: `Kami mengumpulkan informasi yang Anda berikan secara langsung, termasuk:
• Nama lengkap dan alamat email saat mendaftar akun
• Informasi pembayaran (diproses oleh gateway pembayaran pihak ketiga yang aman)
• Riwayat pembelian dan unduhan tema
• Komunikasi yang Anda kirimkan kepada tim support kami

Kami juga mengumpulkan data secara otomatis seperti alamat IP, jenis browser, halaman yang dikunjungi, dan waktu kunjungan untuk keperluan analitik dan keamanan.`,
  },
  {
    title: "2. Penggunaan Informasi",
    content: `Informasi yang kami kumpulkan digunakan untuk:
• Memproses transaksi dan mengirimkan produk yang dibeli
• Mengirimkan konfirmasi pembelian dan informasi akun
• Memberikan dukungan teknis dan menjawab pertanyaan
• Mengirimkan newsletter dan penawaran promosi (jika Anda berlangganan)
• Meningkatkan layanan dan pengalaman pengguna
• Mematuhi kewajiban hukum yang berlaku`,
  },
  {
    title: "3. Berbagi Informasi",
    content: `Kami tidak menjual, menyewakan, atau memperdagangkan data pribadi Anda kepada pihak ketiga. Informasi hanya dibagikan kepada:
• Penyedia layanan pembayaran untuk memproses transaksi
• Penyedia hosting dan infrastruktur teknis
• Otoritas hukum jika diwajibkan oleh peraturan yang berlaku`,
  },
  {
    title: "4. Keamanan Data",
    content: `Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda dari akses tidak sah, pengungkapan, perubahan, atau penghancuran. Semua koneksi ke situs kami dienkripsi menggunakan SSL/TLS.`,
  },
  {
    title: "5. Hak Pengguna",
    content: `Anda memiliki hak untuk:
• Mengakses data pribadi yang kami simpan tentang Anda
• Meminta koreksi data yang tidak akurat
• Meminta penghapusan akun dan data pribadi
• Membatalkan langganan newsletter kapan saja
• Mengajukan keberatan atas pemrosesan data Anda

Untuk menggunakan hak-hak ini, hubungi kami di privacy@openthemes.id`,
  },
  {
    title: "6. Cookie",
    content: `Kami menggunakan cookie untuk meningkatkan pengalaman pengguna, menyimpan preferensi, dan menganalisis lalu lintas situs. Anda dapat mengatur browser Anda untuk menolak cookie, namun beberapa fitur situs mungkin tidak berfungsi optimal.`,
  },
  {
    title: "7. Perubahan Kebijakan",
    content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di situs. Penggunaan layanan kami setelah pembaruan berarti Anda menyetujui kebijakan yang telah diperbarui.`,
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">Legal</p>
          <h1 className="text-4xl font-bold mb-4">Kebijakan Privasi</h1>
          <p className="text-white/60">Terakhir diperbarui: 1 Januari 2026</p>
        </div>
      </section>

      <section className="container-page py-16 max-w-3xl mx-auto">
        <div className="bg-[#1c3a6e]/5 border border-[#1c3a6e]/10 rounded-2xl p-5 mb-10 text-sm text-gray-600 leading-relaxed">
          Kebijakan Privasi ini menjelaskan bagaimana Open Themes ("kami") mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan marketplace kami di openthemes.id.
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
          Pertanyaan tentang kebijakan privasi kami? Hubungi: <a href="mailto:privacy@openthemes.id" className="text-[#3d8c1e] font-medium">privacy@openthemes.id</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
