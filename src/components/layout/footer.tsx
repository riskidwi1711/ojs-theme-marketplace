"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";
import { subscribeNewsletter } from "@/api/newsletter";
import { FaXTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa6";

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const socialLinks = [
  { name: "X", icon: FaXTwitter, href: "#" },
  { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { name: "Instagram", icon: FaInstagram, href: "#" },
  { name: "YouTube", icon: FaYoutube, href: "#" },
];

const links = {
  useful: [
    { label: "Beranda", href: "/" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Kontak", href: "/kontak" },
    { label: "FAQ", href: "/faq" },
    { label: "Help Center", href: "/help" },
    { label: "Karir", href: "/karir" },
    { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
    { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    { label: "Sitemap", href: "/sitemap" },
  ],
  help: [
    { label: "Cara Pembelian", href: "/help/cara-pembelian" },
    { label: "Cara Instalasi", href: "/help/cara-instalasi" },
    { label: "Pengembalian Dana", href: "/help/pengembalian-dana" },
    { label: "Cek Kompatibilitas", href: "/help/cek-kompatibilitas" },
    { label: "Live Preview", href: "/help/live-preview" },
    { label: "Lisensi Tema", href: "/help/lisensi-tema" },
    { label: "Masalah Lainnya", href: "/help/masalah-lainnya" },
  ],
  business: [
    { label: "Jual Tema di OJSMart", href: "/jual-tema" },
    { label: "Program Afiliasi", href: "/afiliasi" },
    { label: "Jadi Developer Partner", href: "/developer-partner" },
    { label: "Pasang Iklan", href: "/pasang-iklan" },
    { label: "OJSMart Blog", href: "/blog" },
  ],
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main footer */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand col */}
        <div className="lg:col-span-1">
          <a href="/" className="flex items-center mb-3">
            <img src="/logo.png" alt="Open Themes" className="h-[56px] md:h-[64px] w-auto" />
          </a>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Open Themes – Marketplace Tema OJS Indonesia. Temukan ribuan tema profesional untuk jurnal akademik Anda.
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)]"><MailIcon /></span>
              <span className="font-medium">support@openthemes.id</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--color-primary)] mt-0.5"><MapIcon /></span>
              <span className="font-medium">Jakarta, Indonesia</span>
            </div>
          </div>
          {/* Socials - With proper icons */}
          <div className="flex gap-2 mt-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                aria-label={social.name}
              >
                <social.icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-base font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wide">Tautan Berguna</h4>
          <ul className="space-y-2">
            {links.useful.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Center */}
        <div>
          <h4 className="text-base font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wide">Pusat Bantuan</h4>
          <ul className="space-y-2">
            {links.help.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* OJSMart Business */}
        <div>
          <h4 className="text-base font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wide">OJSMart Bisnis</h4>
          <ul className="space-y-2">
            {links.business.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-gray-600 hover:text-[var(--color-primary)] transition-colors font-medium">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <NewsletterForm />
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="w-full px-4 md:px-8 lg:px-16 flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
          <p className="text-sm text-gray-500">
            © 2026 <span className="text-[var(--color-primary)] font-bold">Open Themes</span>. All rights reserved.
          </p>
          {/* Payment logos - Larger */}
          <div className="flex items-center gap-4">
            <img src="/payment-logos/visa.png" alt="Visa" className="h-6 w-auto object-contain" />
            <img src="/payment-logos/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
            <img src="/payment-logos/bca.png" alt="BCA" className="h-6 w-auto object-contain" />
            <img src="/payment-logos/mandiri.png" alt="Mandiri" className="h-6 w-auto object-contain" />
          </div>
        </div>
      </div>
    </footer>
  );
};

function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast("Masukkan email yang valid", "error");
      return;
    }

    setLoading(true);
    try {
      await subscribeNewsletter(email);
      toast("Berhasil berlangganan newsletter!", "success");
      setEmail("");
    } catch (error: any) {
      toast(error?.response?.data?.message || "Gagal berlangganan", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-base font-extrabold text-[#1a1a2e] mb-4 uppercase tracking-wide">Newsletter Open Themes</h4>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        Dapatkan info tema terbaru, promo, dan tutorial OJS langsung di inbox Anda.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Alamat email Anda"
          disabled={loading}
          className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs outline-none focus:border-[var(--color-primary)] transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-600)] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Memproses..." : "Langganan"}
        </button>
      </form>
    </div>
  );
}

export default Footer;
