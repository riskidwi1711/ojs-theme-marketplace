"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

function RegisterForm() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = React.useState(searchParams.get("name") ?? "");
  const [email, setEmail] = React.useState(searchParams.get("email") ?? "");
  const [password, setPassword] = React.useState(searchParams.get("password") ?? "");
  const [confirm, setConfirm] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) router.replace("/account");
  }, [user, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Konfirmasi password tidak cocok"); return; }
    if (password.length < 8) { setError("Password minimal 8 karakter"); return; }
    setSubmitting(true);
    try {
      await register(email, password, name);
      router.push("/themes?voucher=NEWUSER15");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container-page py-16 flex items-center justify-center min-h-[calc(100vh-160px)]">
        <div className="w-full max-w-md">
          {/* Promo banner */}
          <div className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1c3a6e] to-[#3d8c1e] p-px">
            <div className="rounded-2xl bg-gradient-to-r from-[#1a3460]/95 to-[#2e6b16]/95 px-5 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-2xl font-black text-white">
                🎁
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Khusus Member Baru</p>
                <p className="text-base font-extrabold text-white leading-tight">Diskon 15% untuk pembelian pertamamu!</p>
                <p className="text-xs text-white/60 mt-0.5">Kode <span className="font-mono font-bold text-white">NEWUSER15</span> otomatis aktif setelah daftar</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <a href="/">
              <img src="/logo.png" alt="Open Themes" className="h-10 mx-auto mb-4" />
            </a>
            <h1 className="text-2xl font-extrabold text-gray-900">Buat Akun Baru</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sudah punya akun?{" "}
              <Link href="/auth/login" className="text-[var(--color-primary-600)] font-semibold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="email@kamu.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="Min. 8 karakter"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="Ulangi password"
                />
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Dengan mendaftar, kamu menyetujui{" "}
                <a href="#" className="underline hover:text-gray-600">Syarat & Ketentuan</a> dan{" "}
                <a href="#" className="underline hover:text-gray-600">Kebijakan Privasi</a> kami.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Memproses..." : "Daftar Sekarang"}
              </button>
            </form>
          </div>
        </div>
      </main>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <React.Suspense fallback={null}>
        <RegisterForm />
      </React.Suspense>
      <Footer />
    </div>
  );
}
