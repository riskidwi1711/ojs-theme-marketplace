import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Cara Pembelian Tema OJS",
  description: "Panduan lengkap proses pembelian tema OJS di Open Themes, dari memilih tema hingga mengunduh file setelah pembayaran.",
  keywords: ["cara beli tema OJS", "pembelian tema jurnal", "checkout OJS theme"],
  alternates: { canonical: "/help/cara-pembelian" },
  openGraph: {
    title: "Cara Pembelian Tema OJS | Open Themes",
    description: "Panduan lengkap proses pembelian tema OJS di Open Themes.",
    url: "/help/cara-pembelian",
  },
};

const steps = [
  { step: "01", title: "Pilih Tema", desc: "Jelajahi koleksi tema di halaman Themes. Gunakan filter berdasarkan versi OJS, kategori, atau harga. Klik tema untuk melihat detail, tangkapan layar, dan demo live." },
  { step: "02", title: "Tambahkan ke Keranjang", desc: "Klik tombol 'Beli Sekarang' atau 'Tambah ke Keranjang'. Anda dapat melanjutkan berbelanja atau langsung checkout." },
  { step: "03", title: "Login / Daftar Akun", desc: "Masuk ke akun Anda atau daftar jika belum memiliki akun. Proses registrasi hanya membutuhkan nama dan email." },
  { step: "04", title: "Checkout & Pembayaran", desc: "Periksa ringkasan pesanan, pilih metode pembayaran (transfer bank, QRIS, e-wallet, atau kartu kredit), lalu selesaikan pembayaran." },
  { step: "05", title: "Konfirmasi & Unduh", desc: "Setelah pembayaran terkonfirmasi (biasanya instan untuk e-wallet/QRIS, atau 1×24 jam untuk transfer bank), file tema tersedia di halaman Akun > Pembelian Saya." },
];

export default function CaraPembelianPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Cara Pembelian</h1>
          <p className="text-white/60">Panduan lengkap membeli tema di Open Themes.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto">
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

        <div className="mt-12 p-5 rounded-2xl bg-[#3d8c1e]/8 border border-[#3d8c1e]/20">
          <p className="font-semibold text-[#3d8c1e] mb-1">Butuh bantuan lebih lanjut?</p>
          <p className="text-sm text-gray-600">Hubungi kami di <a href="mailto:support@openthemes.id" className="text-[#3d8c1e] font-medium">support@openthemes.id</a> atau kunjungi halaman <a href="/kontak" className="text-[#3d8c1e] font-medium">Kontak</a>.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
