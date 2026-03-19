"use client";
import * as React from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const faqs = [
  {
    category: "Pembelian",
    items: [
      { q: "Bagaimana cara membeli tema?", a: "Pilih tema yang Anda inginkan, klik 'Beli Sekarang', masuk ke akun atau daftar terlebih dahulu, lalu selesaikan pembayaran. Setelah pembayaran terkonfirmasi, file tema langsung tersedia di halaman akun Anda." },
      { q: "Metode pembayaran apa yang tersedia?", a: "Kami menerima pembayaran via transfer bank (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, Dana, dan kartu kredit/debit Visa & Mastercard." },
      { q: "Apakah ada garansi uang kembali?", a: "Ya, kami menawarkan garansi uang kembali 7 hari jika tema terbukti tidak berfungsi sesuai deskripsi dan tim kami tidak dapat memperbaikinya." },
      { q: "Berapa lama lisensi tema berlaku?", a: "Lisensi berlaku seumur hidup untuk 1 domain. Update gratis tersedia selama 6 bulan sejak tanggal pembelian. Perpanjangan update tersedia dengan biaya tambahan." },
    ],
  },
  {
    category: "Instalasi & Teknis",
    items: [
      { q: "Versi OJS apa yang didukung?", a: "Setiap tema mencantumkan versi OJS yang didukung di halaman produk. Umumnya tema kami mendukung OJS 3.3.x dan 3.4.x." },
      { q: "Apakah saya perlu pengetahuan coding?", a: "Tidak. Tema kami dirancang untuk dipasang tanpa coding. Cukup upload file tema melalui panel admin OJS dan aktifkan." },
      { q: "Berapa lama proses instalasi?", a: "Instalasi mandiri biasanya membutuhkan 15–30 menit. Jika menggunakan layanan instalasi kami, tim akan menyelesaikan dalam 1×24 jam kerja." },
    ],
  },
  {
    category: "Lisensi",
    items: [
      { q: "Apakah saya bisa menggunakan tema untuk beberapa journal?", a: "Satu lisensi berlaku untuk satu domain/instalasi OJS. Untuk penggunaan di beberapa domain, Anda perlu membeli lisensi tambahan atau menghubungi kami untuk paket multi-lisensi." },
      { q: "Apakah tema boleh dimodifikasi?", a: "Ya, Anda boleh memodifikasi tema untuk kebutuhan journal Anda. Namun Anda tidak diperkenankan mendistribusikan ulang atau menjual kembali tema tersebut." },
    ],
  },
];

export default function FaqPage() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-20">
        <div className="container-page text-center max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3d8c1e] mb-4">FAQ</p>
          <h1 className="text-4xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-white/60">Temukan jawaban atas pertanyaan umum seputar pembelian, instalasi, dan lisensi tema.</p>
        </div>
      </section>

      <section className="container-page py-16 max-w-3xl mx-auto">
        <div className="space-y-10">
          {faqs.map((group) => (
            <div key={group.category}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#3d8c1e] mb-4">{group.category}</h2>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const key = `${group.category}-${item.q}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-[#1a1a2e] text-sm pr-4">{item.q}</span>
                        <span className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-[#1c3a6e]/5 border border-[#1c3a6e]/10 text-center">
          <p className="font-semibold text-[#1a1a2e] mb-2">Tidak menemukan jawaban yang Anda cari?</p>
          <p className="text-sm text-gray-500 mb-4">Tim kami siap membantu Anda secara langsung.</p>
          <a href="/kontak" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] text-white text-sm font-semibold hover:opacity-90 transition">
            Hubungi Kami
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
