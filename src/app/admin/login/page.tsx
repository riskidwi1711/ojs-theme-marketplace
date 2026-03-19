"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/context/adminAuth";
import { LuEye, LuEyeOff, LuMail, LuLock, LuArrowLeft, LuLoaderCircle, LuTriangleAlert } from "react-icons/lu";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0b1624]" />
      <div className="absolute inset-0 bg-linear-to-br from-[#1c3a6e]/60 via-[#0b1624] to-[#071a0a]/60" />

      {/* Blobs */}
      <div className="absolute top-[-8%] left-[-8%] w-[480px] h-[480px] bg-[#1c3a6e] rounded-full blur-[140px] opacity-30" />
      <div className="absolute bottom-[-8%] right-[-5%] w-[400px] h-[400px] bg-[#3d8c1e] rounded-full blur-[140px] opacity-20" />
      <div className="absolute top-[40%] right-[10%] w-48 h-48 bg-[#1e7ab5] rounded-full blur-[90px] opacity-15" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <React.Suspense>
        <LoginForm />
      </React.Suspense>
    </div>
  );
}

function LoginForm() {
  const { loginAdmin, user } = useAdminAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get("next") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (user && user.role === "admin") {
      router.replace(next);
    }
  }, [user, router, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
      // Navigation is handled by the useEffect above (after user state is committed)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal. Periksa kredensial Anda.");
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm">
      {/* Logo text */}
      <div className="text-center mb-8">
        <div className="inline-block">
          <div className="text-3xl font-extrabold tracking-tight leading-none">
            <span className="text-[#4a7fc1]">Open</span><span className="text-[#3d8c1e]">Themes</span>
          </div>
          <div className="flex items-center gap-2 mt-1.5 justify-center">
            <span className="h-px w-8 bg-white/15" />
            <span className="text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">OJS Marketplace</span>
            <span className="h-px w-8 bg-white/15" />
          </div>
        </div>
        <p className="text-xs text-white/30 mt-4">Admin Panel · Masuk untuk mengelola sistem</p>
      </div>

      {/* Card */}
      <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
        <div className="p-7">
          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <LuTriangleAlert size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <LuMail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder-white/15 focus:outline-none focus:ring-1 focus:ring-[#3d8c1e]/70 focus:border-[#3d8c1e]/50 transition"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <LuLock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white text-sm placeholder-white/15 focus:outline-none focus:ring-1 focus:ring-[#3d8c1e]/70 focus:border-[#3d8c1e]/50 transition"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/55 transition-colors"
                >
                  {showPassword ? <LuEyeOff size={15} /> : <LuEye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1 py-3 rounded-xl bg-linear-to-r from-[#1c3a6e] to-[#3d8c1e] text-white font-semibold text-sm tracking-wide hover:from-[#162f5a] hover:to-[#317318] transition-all shadow-lg shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LuLoaderCircle size={15} className="animate-spin" />
                  Memproses...
                </span>
              ) : (
                "Masuk sebagai Admin"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-white/[0.05] bg-white/[0.02]">
          <a
            href="/"
            className="flex items-center justify-center gap-1.5 text-xs text-white/25 hover:text-white/55 transition-colors"
          >
            <LuArrowLeft size={11} />
            Kembali ke Homepage
          </a>
        </div>
      </div>

      {/* Security notice */}
      <p className="mt-5 text-center text-xs text-white/15">
        Akses terbatas · Hanya untuk administrator terdaftar
      </p>
    </div>
  );
}
