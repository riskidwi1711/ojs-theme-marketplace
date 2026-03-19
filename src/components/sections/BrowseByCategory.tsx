"use client";

import * as React from "react";
import {
  FaBook,
  FaMicrophone,
  FaUnlockAlt,
  FaMicroscope,
  FaHospital,
  FaBalanceScale,
  FaNewspaper,
  FaArchive,
} from "react-icons/fa";
import { getCategories } from "@/api/categories";
import type { CategoryItem } from "@/types/category";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "Jurnal Ilmiah": FaBook,
  "Konferensi": FaMicrophone,
  "Open Access": FaUnlockAlt,
  "Sains & Teknik": FaMicroscope,
  "Kedokteran": FaHospital,
  "Hukum & Sosial": FaBalanceScale,
  "Multi-Journal": FaNewspaper,
  "Repository": FaArchive,
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { slug: "jurnal-ilmiah", name: "Jurnal Ilmiah", bg: "from-blue-50 to-blue-100", color: "text-blue-600" },
  { slug: "konferensi", name: "Konferensi", bg: "from-purple-50 to-purple-100", color: "text-purple-600" },
  { slug: "open-access", name: "Open Access", bg: "from-green-50 to-green-100", color: "text-green-600" },
  { slug: "sains-teknik", name: "Sains & Teknik", bg: "from-cyan-50 to-cyan-100", color: "text-cyan-600" },
  { slug: "kedokteran", name: "Kedokteran", bg: "from-red-50 to-red-100", color: "text-red-600" },
  { slug: "hukum-sosial", name: "Hukum & Sosial", bg: "from-amber-50 to-amber-100", color: "text-amber-600" },
  { slug: "multi-journal", name: "Multi-Journal", bg: "from-indigo-50 to-indigo-100", color: "text-indigo-600" },
  { slug: "repository", name: "Repository", bg: "from-gray-50 to-gray-100", color: "text-gray-600" },
];

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);

export const BrowseByCategory: React.FC = () => {
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getCategories().then((data) => {
      setCategories(Array.isArray(data) && data.length > 0 ? data : DEFAULT_CATEGORIES);
    }).catch(() => {
      setCategories(DEFAULT_CATEGORIES);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <section className="w-full py-10 px-4 md:px-8 lg:px-16 bg-white">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Jelajah Berdasarkan Kategori</h2>
            <p className="text-sm text-gray-500">Temukan tema OJS yang sesuai dengan kebutuhan jurnal Anda</p>
          </div>
        </div>
        <a href="/themes" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-600)] transition-colors">
          Lihat Semua
          <ChevronRight />
        </a>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : (
          categories.map((cat) => {
            const IconComponent = ICON_MAP[cat.name] || FaBook;
            return (
              <a
                key={cat.slug}
                href={`/themes?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 hover:scale-[1.04]"
              >
                {/* Icon with gradient background */}
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${cat.bg || "from-gray-50 to-gray-100"} flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-gray-100 group-hover:border-transparent group-hover:ring-2 group-hover:ring-[var(--color-primary)]/25 group-hover:ring-offset-2`}>
                  <IconComponent size={38} className={`${cat.color || "text-gray-600"} transition-transform duration-300 group-hover:scale-110`} />
                </div>

                {/* Category name */}
                <span className="text-sm font-bold text-center leading-tight text-gray-700 group-hover:text-[var(--color-primary)] transition-colors">
                  {cat.name}
                </span>
              </a>
            );
          })
        )}
      </div>
    </section>
  );
};

export default BrowseByCategory;
