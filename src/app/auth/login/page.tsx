"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <React.Suspense fallback={<main className="container-page py-16" />}> 
        <LoginInner />
      </React.Suspense>
      <Footer />
    </div>
  );
}

function LoginInner() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get("next") || "/account";
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      // Redirect admin to admin dashboard, customer to next page
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace(next);
      }
    }
  }, [user, loading, next, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push(next);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <main className="container-page py-16 flex items-center justify-center min-h-[calc(100vh-160px)]">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <a href="/">
              <img src="/logo-icon.png" alt="Open Themes" className="h-24 mx-auto mb-4" />
            </a>
            <h1 className="text-2xl font-extrabold text-gray-900">Masuk ke Akunmu</h1>
            <p className="text-sm text-gray-500 mt-1">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-[var(--color-primary-600)] font-semibold hover:underline">
                Daftar gratis
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Password
                  </label>
                  <Link href="/auth/forgot-password" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Lupa password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "Memproses..." : "Masuk"}
              </button>
            </form>
          </div>
        </div>
      </main>
  );
}
