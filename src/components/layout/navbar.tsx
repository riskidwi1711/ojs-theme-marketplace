"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { useWishlist } from "@/context/wishlist";
import { LuSearch } from "react-icons/lu";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

interface RecentItem { id: string; name: string; image?: string; slug: string }

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { count: cartCount, totalIDR } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [recentItems, setRecentItems] = React.useState<RecentItem[]>([]);
  const [recentOpen, setRecentOpen] = React.useState(false);
  const recentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("recently_viewed");
      if (saved) setRecentItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (recentRef.current && !recentRef.current.contains(e.target as Node)) {
        setRecentOpen(false);
      }
    };
    if (recentOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [recentOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/themes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const formattedTotal = React.useMemo(
    () =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(totalIDR),
    [totalIDR]
  );

  const navLinks = [
    { label: "New Arrivals", hot: true, href: "/themes/new-arrivals" },
    { label: "Best Sellers", href: "/themes/best-sellers" },
    { label: "OJS 3.x", highlight: "green", href: "/themes/ojs-3x" },
    { label: "OJS 3.4+", highlight: "blue", href: "/themes/ojs-34" },
    { label: "Free Themes", highlight: "orange", href: "/themes/free" },
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "/docs" },
    { label: "Plugins", href: "/plugins" },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Main header row */}
      <div className="w-full px-4 md:px-8 lg:px-16 flex items-center gap-4 h-18">
        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <img src="/logo.png" alt="Open Themes – OJS Marketplace" className="h-[560px] md:h-[62px] w-auto" />
        </a>

        {/* Search */}
        <div className="flex-1 hidden lg:flex items-center max-w-[560px] mx-auto">
          <form onSubmit={handleSearch} className="flex w-full rounded-lg border border-[var(--color-border)] overflow-hidden h-11">
            <button type="button" className="flex items-center gap-1.5 px-3.5 bg-gray-50 border-r border-[var(--color-border)] text-sm font-semibold text-gray-700 whitespace-nowrap shrink-0">
              All Themes <ChevronDown />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 text-sm outline-none bg-white placeholder:text-gray-400"
              placeholder="Search OJS themes, templates, and plugins..."
            />
            <button type="submit" className="w-12 flex items-center justify-center bg-[var(--color-primary)] text-white shrink-0 hover:bg-[var(--color-primary-600)] transition-colors">
              <LuSearch size={20} />
            </button>
          </form>
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-8">
          <a href="/account" className="flex flex-col items-center gap-1 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
            <UserIcon />
            <span className="text-xs leading-none font-bold">Account</span>
          </a>
          <a href="/wishlist" className="relative flex flex-col items-center gap-1 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
            <HeartIcon />
            <span className="text-xs leading-none font-bold">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-danger)] text-[11px] font-bold text-white shadow-sm">
                {wishlistCount}
              </span>
            )}
          </a>
          <a href="/cart" className="relative flex items-center gap-3 text-gray-700 hover:text-[var(--color-primary)] transition-colors">
            <div className="relative">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-[11px] font-bold text-black shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-xs text-gray-500 font-bold">Cart</span>
              <span className="text-sm font-extrabold text-[#1a1a2e]">{formattedTotal}</span>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="w-full px-4 md:px-8 lg:px-16 flex items-center h-12">
          {/* BROWSE THEMES button - Larger */}
          <a
            href="/themes"
            className={[
              "flex items-center gap-2 text-base font-bold px-5 h-full shrink-0 transition-colors",
              pathname === "/themes" ? "bg-[var(--color-primary)] text-white" : "bg-[#1c3b6d] text-white hover:bg-[#163060]"
            ].join(" ")}
          >
            <MenuIcon />
            BROWSE THEMES
          </a>

          {/* Nav links - Larger fonts */}
          <nav className="flex items-center gap-1 overflow-x-auto flex-1 px-2 h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={[
                    "whitespace-nowrap px-3.5 h-full flex items-center text-sm font-semibold transition-colors relative",
                    isActive
                      ? "text-[var(--color-primary-700)]"
                      : (link.highlight === "green" ? "text-green-600 hover:text-green-700" :
                         link.highlight === "blue" ? "text-blue-600 hover:text-blue-700" :
                         link.highlight === "orange" ? "text-orange-500 font-bold" :
                         "text-gray-700 hover:text-[var(--color-primary)]"),
                  ].join(" ")}
                >
                  {link.label}
                  {link.hot && (
                    <span className="absolute top-0.5 right-0 text-[10px] font-bold text-[var(--color-danger)] uppercase">hot</span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Recently Viewed Dropdown */}
          <div ref={recentRef} className="hidden lg:block relative shrink-0 ml-auto">
            <button
              onClick={() => setRecentOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors pr-2 h-full py-3 ${recentOpen ? "text-[var(--color-primary)]" : "text-gray-600 hover:text-[var(--color-primary)]"}`}
            >
              <ClockIcon />
              Recently Viewed
              <span className={`transition-transform duration-200 ${recentOpen ? "rotate-180" : ""}`}>
                <ChevronDown />
              </span>
            </button>

            {recentOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Terakhir Dilihat</p>
                </div>
                {recentItems.length === 0 ? (
                  <div className="flex flex-col items-center py-8 px-4 text-center">
                    <ClockIcon />
                    <p className="text-sm font-medium text-gray-500 mt-2">Belum ada riwayat</p>
                    <p className="text-xs text-gray-400 mt-1">Tema yang kamu lihat akan muncul di sini</p>
                  </div>
                ) : (
                  <ul className="py-1 max-h-64 overflow-y-auto">
                    {recentItems.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`/themes/${item.slug}`}
                          onClick={() => setRecentOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0 border border-gray-100">
                              <span className="text-lg">📦</span>
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="px-4 py-2.5 border-t border-gray-100">
                  <button
                    onClick={() => { setRecentItems([]); localStorage.removeItem("recently_viewed"); }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium"
                  >
                    Hapus riwayat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
