import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Cara Menggunakan Live Preview",
  description: "Panduan menggunakan fitur pratinjau langsung tema OJS sebelum membeli. Lihat tampilan nyata di browser Anda.",
  keywords: ["live preview OJS theme", "pratinjau tema jurnal", "demo tema OJS"],
  alternates: { canonical: "/help/live-preview" },
  openGraph: {
    title: "Cara Menggunakan Live Preview | Open Themes",
    description: "Panduan menggunakan fitur pratinjau langsung tema OJS sebelum membeli.",
    url: "/help/live-preview",
  },
};

export default function LivePreviewPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-gradient-to-br from-[#1c3a6e] to-[#0f172a] text-white py-16">
        <div className="container-page">
          <a href="/help" className="text-xs text-white/40 hover:text-white/70 transition-colors mb-4 inline-block">← Pusat Bantuan</a>
          <h1 className="text-3xl font-bold mb-2">Live Preview</h1>
          <p className="text-white/60">Cara menggunakan fitur pratinjau langsung sebelum membeli.</p>
        </div>
      </section>

      <section className="container-page py-14 max-w-3xl mx-auto space-y-10">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Apa itu Live Preview?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Live Preview memungkinkan Anda melihat tampilan tema secara langsung pada contoh journal sungguhan sebelum memutuskan untuk membeli. Setiap tema yang memiliki fitur ini akan menampilkan tombol <strong>"Live Preview"</strong> di halaman produk.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Cara Menggunakan Live Preview</h2>
          <ol className="space-y-6">
            {[
              { n: "1", t: "Buka Halaman Produk", d: "Pilih tema yang ingin Anda lihat dari daftar tema. Buka halaman detail produk tersebut." },
              { n: "2", t: "Klik Tombol Live Preview", d: "Temukan tombol 'Live Preview' atau 'Lihat Demo' di area aksi produk. Tombol ini akan membuka tab baru." },
              { n: "3", t: "Jelajahi Demo Journal", d: "Demo journal menampilkan tema dalam kondisi nyata dengan konten contoh. Anda dapat menjelajahi homepage, halaman artikel, dan navigasi lainnya." },
              { n: "4", t: "Uji Responsivitas", d: "Gunakan DevTools browser (F12) untuk mengubah ukuran layar dan melihat tampilan tema di perangkat mobile dan tablet." },
            ].map((item) => (
              <li key={item.n} className="flex gap-4">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1c3a6e] to-[#3d8c1e] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{item.n}</span>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{item.t}</p>
                  <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{item.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="p-5 rounded-2xl bg-[#3d8c1e]/8 border border-[#3d8c1e]/20">
          <p className="font-semibold text-[#3d8c1e] mb-1">Tidak ada tombol Live Preview?</p>
          <p className="text-sm text-gray-600">Beberapa tema mungkin belum memiliki demo aktif. Anda dapat melihat tangkapan layar di galeri produk atau menghubungi kami untuk meminta demo khusus.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
