"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useCart } from "@/context/cart";
import { useAuth } from "@/context/auth";
import { validateVoucher } from "@/api/vouchers";
import { syncMyCartToBackend, createMyOrder } from "@/api/customer";
import { LuLoader, LuLogIn, LuArrowRight, LuTag, LuX, LuCheck } from "react-icons/lu";
import { VoucherValidateResult } from "@/types";

const fmt = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalIDR, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!authLoading && !user) {
      const next = encodeURIComponent(window.location.pathname);
      router.replace(`/auth/login?next=${next}`);
    }
  }, [user, authLoading, router]);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [institution, setInstitution] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState("");

  // Voucher state
  const [voucherInput, setVoucherInput] = React.useState("");
  const [voucherResult, setVoucherResult] = React.useState<VoucherValidateResult | null>(null);
  const [voucherLoading, setVoucherLoading] = React.useState(false);
  const [voucherError, setVoucherError] = React.useState("");

  // Pre-fill from auth profile + saved checkout info
  React.useEffect(() => {
    if (user) {
      setEmail(user.email ?? "");
      setName(user.name ?? "");
    }
    try {
      const saved = JSON.parse(localStorage.getItem("ojs_checkout_info") ?? "{}");
      if (saved.institution) setInstitution(saved.institution);
      if (saved.phone) setPhone(saved.phone);
    } catch { /* ignore */ }
  }, [user]);

  // Redirect if cart empty
  React.useEffect(() => {
    if (!authLoading && items.length === 0) router.replace("/cart");
  }, [items, authLoading, router]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Nama lengkap wajib diisi";
    if (!email.trim()) errs.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid";
    return errs;
  };

  const syncCart = async () => {
    await syncMyCartToBackend(items);
  };

  const handleApplyVoucher = async () => {
    if (!voucherInput.trim()) return;
    setVoucherError("");
    setVoucherLoading(true);
    try {
      const res = await validateVoucher(voucherInput.trim(), totalIDR);
      if (res.valid) {
        setVoucherResult(res);
        setVoucherError("");
      } else {
        setVoucherResult(null);
        setVoucherError(res.message);
      }
    } catch {
      setVoucherResult(null);
      setVoucherError("Gagal memvalidasi voucher. Coba lagi.");
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherResult(null);
    setVoucherInput("");
    setVoucherError("");
  };

  const finalTotal = voucherResult ? voucherResult.finalIDR : totalIDR;

  const handleConfirm = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setApiError("");
    setSubmitting(true);

    try {
      // 0. Save institution & phone for next visit
      localStorage.setItem("ojs_checkout_info", JSON.stringify({ institution, phone }));

      // 1. Sync local cart to backend
      await syncCart();

      // 2. Create order — server creates Xendit invoice and returns xenditInvoiceUrl
      const checkoutRes = await createMyOrder({
        voucherCode: voucherResult?.code ?? "",
        shipping: { name, email, institution, phone },
        payment: { method: "xendit" }
      });
      const order = checkoutRes.order;
      const orderId: string = order?.id ?? order?._id ?? "";
      const invoiceUrl: string = order?.xenditInvoiceUrl ?? "";

      // 3. Redirect to Xendit invoice page
      clearCart();
      if (invoiceUrl) {
        window.location.href = invoiceUrl;
      } else {
        router.push(`/checkout/confirmation?orderId=${orderId}`);
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LuLoader size={28} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (items.length === 0) return null;

  // Not logged in → auth gate
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-16 flex items-center justify-center">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-sm w-full">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <LuLogIn size={24} className="text-gray-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Login Diperlukan</h2>
            <p className="text-sm text-gray-500 mb-6">Kamu perlu login untuk melanjutkan proses checkout dan menyimpan riwayat pesanan.</p>
            <Link href="/auth/login?redirect=/checkout"
              className="block w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm text-center hover:bg-[var(--color-primary)] hover:text-white transition-colors">
              Login Sekarang
            </Link>
            <Link href="/auth/register" className="block mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Belum punya akun? Daftar gratis
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="container-page">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#3e9020] transition-colors">Beranda</Link>
            <span className="text-gray-300">/</span>
            <Link href="/cart" className="hover:text-[#3e9020] transition-colors">Keranjang</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-medium">Checkout</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

          {apiError && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {apiError}
            </div>
          )}

          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* ── LEFT: Informasi Pemesan ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-800 text-base mb-5">Informasi Pemesan</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className={`w-full h-11 rounded-xl border bg-white px-4 text-sm text-gray-800 outline-none focus:border-[#3e9020] transition-colors ${errors.name ? "border-red-400" : "border-gray-200"}`} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@institusi.ac.id"
                    className={`w-full h-11 rounded-xl border bg-white px-4 text-sm text-gray-800 outline-none focus:border-[#3e9020] transition-colors ${errors.email ? "border-red-400" : "border-gray-200"}`} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Institusi / Universitas</label>
                  <input type="text" value={institution} onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Universitas / Lembaga"
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none focus:border-[#3e9020] transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Nomor WhatsApp</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xx-xxxx-xxxx"
                    className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-800 outline-none focus:border-[#3e9020] transition-colors" />
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-gray-800 text-base mb-4">Ringkasan Pesanan</h2>

              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3">
                    <span className="text-xs text-gray-600 leading-snug line-clamp-2 flex-1">{item.name}</span>
                    <span className="text-xs font-medium text-gray-800 shrink-0">{fmt(item.priceIDR)}</span>
                  </li>
                ))}
              </ul>

              <hr className="border-gray-100 mb-3" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-semibold text-gray-800">{fmt(totalIDR)}</span>
              </div>

              {/* Voucher */}
              {!voucherResult ? (
                <div className="mb-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LuTag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={voucherInput}
                        onChange={(e) => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyVoucher()}
                        placeholder="Kode voucher"
                        className="w-full h-10 rounded-xl border border-gray-200 bg-white pl-8 pr-3 text-sm text-gray-800 outline-none focus:border-[#3e9020] transition-colors font-mono uppercase tracking-wider"
                      />
                    </div>
                    <button
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading || !voucherInput.trim()}
                      className="h-10 px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-[#3e9020] hover:text-[#3e9020] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                    >
                      {voucherLoading ? <LuLoader size={13} className="animate-spin" /> : "Pakai"}
                    </button>
                  </div>
                  {voucherError && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
                      <LuX size={11} />{voucherError}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-3 px-3 py-2.5 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-700 min-w-0">
                    <LuCheck size={13} className="shrink-0" />
                    <span className="text-xs font-bold font-mono tracking-wider">{voucherResult.code}</span>
                    <span className="text-xs text-green-600">
                      {voucherResult.type === "percent" ? `- ${voucherResult.value}%` : `- ${fmt(voucherResult.discountIDR)}`}
                    </span>
                  </div>
                  <button onClick={handleRemoveVoucher} className="text-green-400 hover:text-green-700 transition-colors ml-2 shrink-0">
                    <LuX size={13} />
                  </button>
                </div>
              )}

              {voucherResult && (
                <div className="flex items-center justify-between mb-2 text-green-600">
                  <span className="text-sm">Diskon voucher</span>
                  <span className="text-sm font-semibold">- {fmt(voucherResult.discountIDR)}</span>
                </div>
              )}

              <hr className="border-gray-100 mb-4 mt-2" />

              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-gray-700">Total</span>
                <div className="text-right">
                  {voucherResult && <p className="text-xs text-gray-400 line-through">{fmt(totalIDR)}</p>}
                  <span className="text-xl font-bold text-gray-900">{fmt(finalTotal)}</span>
                </div>
              </div>

              <button onClick={handleConfirm} disabled={submitting}
                className="w-full h-12 rounded-xl bg-[#3e9020] hover:bg-[#317318] text-white font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting
                  ? <><LuLoader size={16} className="animate-spin" /> Memproses...</>
                  : <><span>Lanjutkan</span><LuArrowRight size={16} /></>}
              </button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Kamu akan diarahkan ke halaman pembayaran Xendit.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
