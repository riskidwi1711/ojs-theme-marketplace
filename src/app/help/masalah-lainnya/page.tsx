import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Masalah Teknis & FAQ OJS",
  description: "Solusi untuk masalah teknis umum saat menggunakan tema OJS: tema tidak muncul, error instalasi, dan pertanyaan lainnya.",
  keywords: ["masalah OJS theme", "troubleshoot tema jurnal", "error instalasi OJS", "FAQ OJS theme"],
  alternates: { canonical: "/help/masalah-lainnya" },
  openGraph: {
    title: "Masalah Teknis & FAQ OJS | Open Themes",
    description: "Solusi untuk masalah teknis umum saat menggunakan tema OJS.",
    url: "/help/masalah-lainnya",
  },
};

const issues = [
  { title: "Tema tidak muncul setelah diupload", solution: "Pastikan file .zip tidak rusak. Coba ekstrak lalu re-zip ulang folder tema. Pastikan struktur folder benar (folder tema langsung di root .zip, bukan di dalam subfolder)." },
  { title: "Tampilan berantakan setelah aktifasi", solution: "Kosongkan cache browser dan cache OJS (Administration → Clear Caches). Pastikan tidak ada konflik dengan plugin aktif lainnya." },
  { title: "Error saat upload tema", solution: "Periksa batas ukuran upload di php.ini (upload_max_filesize dan post_max_size). Hubungi hosting Anda untuk meningkatkan limit jika diperlukan." },
  { title: "Font atau gambar tidak tampil", solution: "Periksa pengaturan base_url di file config.inc.php OJS Anda. Pastikan URL sudah benar dan menggunakan HTTPS jika situs Anda menggunakan SSL." },
  { title: "Tidak bisa login ke akun Open Themes", solution: "Gunakan fitur 'Lupa Password' di halaman login. Periksa folder spam untuk email reset password. Jika masih bermasalah, hubungi support kami." },
  { title: "File unduhan tidak tersedia setelah pembelian", solution: "Tunggu hingga 1×24 jam untuk transfer bank. Refresh halaman Pembelian Saya. Jika lebih dari 24 jam, hubungi support dengan bukti pembayaran." },
];

export default function MasalahLainnyaPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Masalah Lainnya</h1>
          <p className="text-white/60">Solusi untuk masalah teknis umum yang sering ditemui.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto">
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.title} className="p-5 rounded-2xl border border-gray-100 hover:border-[#1c3a6e]/20 transition-colors">
              <p className="font-semibold text-[#1a1a2e] mb-2 flex items-start gap-2">
                <span className="text-[#1c3a6e] flex-shrink-0 mt-0.5">🔧</span>
                {issue.title}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed ml-6">{issue.solution}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-[#1c3a6e]/5 border border-[#1c3a6e]/10 text-center">
          <p className="font-semibold text-[#1a1a2e] mb-2">Masalah Anda tidak ada di sini?</p>
          <p className="text-sm text-gray-600 mb-4">Deskripsikan masalah Anda secara detail dan tim kami akan membantu sesegera mungkin.</p>
          <a href="/kontak" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] text-white text-sm font-semibold hover:opacity-90 transition">
            Hubungi Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
