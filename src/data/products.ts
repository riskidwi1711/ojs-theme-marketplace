import type { Product } from "@/types";

export const bestSellers: Product[] = [
  { id: "p1", name: "Scholar – Clean Academic Journal OJS", price: 19.0, originalPrice: 29.0, rating: 4.5, reviews: 312, compat: "OJS 3.3+", emoji: "📘", bg: "from-blue-50 to-blue-100", badge: "Terlaris", badgeColor: "bg-red-500 text-white" },
  { id: "p2", name: "Akademia – Open Access Scientific Portal", price: 25.0, rating: 5, reviews: 198, compat: "OJS 3.4+", emoji: "🔬", bg: "from-cyan-50 to-cyan-100" },
  { id: "p3", name: "Primus – Minimalist Journal Theme", price: 15.0, originalPrice: 22.0, rating: 4.5, reviews: 274, compat: "OJS 3.x", emoji: "📄", bg: "from-indigo-50 to-indigo-100", badge: "Sale", badgeColor: "bg-orange-500 text-white" },
  { id: "p4", name: "Lexica – Law Review Journal Template", price: 18.0, rating: 5, reviews: 87, compat: "OJS 3.3+", emoji: "⚖️", bg: "from-amber-50 to-amber-100" },
  { id: "p5", name: "Medicus – Medical & Health Journal", price: 22.0, originalPrice: 30.0, rating: 4, reviews: 143, compat: "OJS 3.4+", emoji: "🏥", bg: "from-red-50 to-pink-100", badge: "New", badgeColor: "bg-blue-500 text-white" },
  { id: "p6", name: "Cosmos – Astronomy & Physics Journal", price: 20.0, rating: 4.5, reviews: 56, compat: "OJS 3.x", emoji: "⭐", bg: "from-violet-50 to-purple-100" },
];

export const justLanding: Product[] = [
  { id: "n1", name: "Nexus – Multi-Journal Platform OJS", price: 35.0, rating: 5, reviews: 24, compat: "OJS 3.4+", emoji: "🗞️", bg: "from-slate-50 to-gray-100", badge: "New", badgeColor: "bg-green-500 text-white" },
  { id: "n2", name: "Clarity – Open Access Minimal Theme", price: 12.0, rating: 4, reviews: 41, compat: "OJS 3.3+", emoji: "🔓", bg: "from-emerald-50 to-green-100" },
  { id: "n3", name: "Summit – Conference & Proceedings", price: 28.0, originalPrice: 38.0, rating: 4.5, reviews: 67, compat: "OJS 3.x", emoji: "🎤", bg: "from-orange-50 to-red-50", badge: "Sale", badgeColor: "bg-red-500 text-white" },
  { id: "n4", name: "Archiva – Repository & Digital Library", price: 30.0, rating: 4, reviews: 19, compat: "OJS 3.4+", emoji: "🗃️", bg: "from-gray-50 to-zinc-100" },
  { id: "n5", name: "Spectrum – Science & Technology Journal", price: 17.0, rating: 4.5, reviews: 88, compat: "OJS 3.3+", emoji: "⚗️", bg: "from-teal-50 to-cyan-100" },
  { id: "n6", name: "Polis – Social Science & Humanities", price: 16.0, originalPrice: 24.0, rating: 4, reviews: 33, compat: "OJS 3.x", emoji: "🌍", bg: "from-green-50 to-lime-100" },
];

export const essentialProducts: Product[] = [
  { id: "e1", name: "Bootstrap3 OJS Classic Theme", price: 9.9, rating: 4, reviews: 510, compat: "OJS 3.x", emoji: "🎨", bg: "from-purple-50 to-violet-100", badge: "Klasik", badgeColor: "bg-purple-500 text-white" },
  { id: "e2", name: "Default Enhanced – OJS Starter", price: 0, rating: 4.5, reviews: 1240, compat: "OJS 3.x", emoji: "⭐", bg: "from-amber-50 to-yellow-100", badge: "Gratis", badgeColor: "bg-green-500 text-white" },
  { id: "e3", name: "Helios – Engineering Journal Theme", price: 21.0, originalPrice: 28.0, rating: 4, reviews: 76, compat: "OJS 3.4+", emoji: "⚙️", bg: "from-orange-50 to-amber-100" },
  { id: "e4", name: "Aether – Interdisciplinary Journal", price: 24.0, rating: 5, reviews: 45, compat: "OJS 3.4+", emoji: "🌐", bg: "from-sky-50 to-blue-100", badge: "New", badgeColor: "bg-blue-500 text-white" },
  { id: "e5", name: "Terra – Agriculture & Environment", price: 18.0, rating: 4, reviews: 29, compat: "OJS 3.3+", emoji: "🌱", bg: "from-green-50 to-emerald-100" },
  { id: "e6", name: "Rhema – Theology & Religion Journal", price: 14.0, originalPrice: 20.0, rating: 4.5, reviews: 38, compat: "OJS 3.x", emoji: "📖", bg: "from-rose-50 to-red-100", badge: "Sale", badgeColor: "bg-red-500 text-white" },
];

export const allStaticProducts: Product[] = [
  ...bestSellers,
  ...justLanding,
  ...essentialProducts,
];
