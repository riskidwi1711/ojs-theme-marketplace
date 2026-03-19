"use client";
import * as React from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ui/product-card";

interface ProductSectionProps {
  title: string;
  products: Product[];
  tabs?: string[];
}

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);

const defaultTabs = ["Semua", "Jurnal Ilmiah", "Konferensi", "Open Access", "Sains & Teknik", "Kedokteran", "Hukum"];

export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  tabs = defaultTabs,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <section className="container-page py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-bold text-[#1a1a2e]">{title}</h2>
        <div className="flex gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-gray-500">
            <ChevronLeft />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors text-gray-500">
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={[
              "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border",
              activeTab === i
                ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                : "bg-white text-gray-600 border-gray-100 hover:bg-gray-50 hover:border-gray-200",
            ].join(" ")}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((p, idx) => (
          <ProductCard key={p.id || idx} product={p} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
