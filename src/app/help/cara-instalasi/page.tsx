import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Cara Instalasi Tema OJS",
  description: "Langkah-langkah lengkap cara menginstal tema OJS di server jurnal Anda. Panduan mudah untuk admin jurnal.",
  keywords: ["instalasi tema OJS", "cara install OJS theme", "upload tema jurnal OJS"],
  alternates: { canonical: "/help/cara-instalasi" },
  openGraph: {
    title: "Cara Instalasi Tema OJS | Open Themes",
    description: "Langkah-langkah lengkap cara menginstal tema OJS di server jurnal Anda.",
    url: "/help/cara-instalasi",
  },
};

const steps = [
  { step: "01", title: "Unduh File Tema", desc: "Masuk ke akun Anda, buka halaman Pembelian Saya, lalu klik tombol Unduh pada tema yang telah dibeli. File akan terunduh dalam format .zip." },
  { step: "02", title: "Login ke Panel Admin OJS", desc: "Buka URL journal Anda dan login sebagai admin (contoh: jurnal.universitas.ac.id/index.php/nama-journal/login)." },
  { step: "03", title: "Upload Tema", desc: "Navigasi ke Website Settings → Plugins → Upload Plugin/Theme. Pilih file .zip tema yang telah diunduh, lalu klik Upload." },
  { step: "04", title: "Aktifkan Tema", desc: "Setelah upload berhasil, temukan tema di daftar plugin. Klik tombol Enable/Aktifkan untuk mengaktifkan tema." },
  { step: "05", title: "Terapkan Tema", desc: "Buka Website Settings → Appearance → Theme. Pilih tema yang baru diaktifkan dari dropdown, lalu klik Save. Tema Anda sudah aktif!" },
  { step: "06", title: "Konfigurasi Tema (Opsional)", desc: "Beberapa tema memiliki pengaturan tambahan di Website Settings → Appearance → Theme Settings. Sesuaikan warna, font, dan opsi lainnya sesuai kebutuhan journal Anda." },
];

export default function CaraInstalasiPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Cara Instalasi Tema</h1>
          <p className="text-white/60">Panduan instalasi tema OJS langkah demi langkah.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8 text-sm text-blue-700">
          <strong>Persyaratan:</strong> Pastikan Anda memiliki akses admin ke instalasi OJS dan mengetahui versi OJS yang digunakan. Cek kompatibilitas tema sebelum menginstal.
        </div>

        <div className="space-y-8">
          {steps.map((s, i) => (
            <div key={s.step} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1c3a6e] to-[#3d8c1e] flex items-center justify-center text-white font-bold text-sm">
                  {s.step}
                </div>
                {i < steps.length - 1 && <div className="w-px h-8 bg-gray-200 mx-auto mt-2" />}
              </div>
              <div className="pb-2">
                <h3 className="font-bold text-[#1a1a2e] mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 rounded-2xl bg-gray-50 border border-gray-100">
          <p className="font-semibold text-[#1a1a2e] mb-2">Mengalami kendala instalasi?</p>
          <p className="text-sm text-gray-600 mb-3">Tim teknis kami juga menyediakan layanan instalasi berbayar. Tema akan dipasang dalam 1×24 jam kerja.</p>
          <a href="/kontak" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c3a6e] text-white text-sm font-semibold hover:bg-[#162f5a] transition">
            Pesan Layanan Instalasi
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
