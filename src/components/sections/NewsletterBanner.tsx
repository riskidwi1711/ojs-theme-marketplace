"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import { FaShieldAlt, FaSyncAlt, FaHeadset } from "react-icons/fa";

const PERKS = [
  { icon: FaShieldAlt, text: "Lisensi resmi & aman" },
  { icon: FaSyncAlt, text: "Update gratis selamanya" },
  { icon: FaHeadset, text: "Support 24/7" },
];

export const NewsletterBanner: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    if (password) params.set("password", password);
    router.push(`/auth/register?${params.toString()}`);
  };

  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-10">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071428] via-[#0d2a52] to-[#071a0a] shadow-xl">
        {/* Dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1.2px, transparent 1.2px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 px-8 md:px-14 py-12">
          {/* Left: copy */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-400/15 border border-emerald-400/25 text-emerald-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Penawaran Member Baru
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
              Daftar Sekarang &<br />
              <span className="text-emerald-400">Hemat 15% OFF</span>
            </h2>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-7 max-w-md mx-auto lg:mx-0">
              Khusus untuk member baru yang mendaftar pertama kali di Open Themes. Nikmati ribuan tema OJS profesional dengan harga lebih hemat.
            </p>
            <ul className="flex flex-col sm:flex-row lg:flex-col gap-2.5 items-center lg:items-start">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-white/70 text-sm">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/30">
                    <LuCheck size={11} className="text-emerald-400" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-48 bg-white/10" />

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="w-full lg:w-[340px] flex flex-col gap-3">
            <div className="text-center lg:text-left mb-1">
              <p className="text-4xl font-black text-emerald-400 leading-none">15%</p>
              <p className="text-white/50 text-xs mt-0.5">diskon untuk pembelian pertama</p>
            </div>
            <input
              type="email"
              required
              placeholder="Alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 px-4 text-sm outline-none focus:border-emerald-400/60 focus:bg-white/12 transition-all"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/35 px-4 text-sm outline-none focus:border-emerald-400/60 focus:bg-white/12 transition-all"
            />
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-900/30 mt-1"
            >
              Daftar & Klaim Diskon <LuArrowRight size={15} />
            </button>
            <p className="text-center text-white/30 text-[11px]">Tidak ada spam · Bisa unsubscribe kapan saja</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterBanner;
