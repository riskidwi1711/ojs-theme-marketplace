"use client";
import * as React from "react";
import { FaSyncAlt, FaHeadset, FaBolt, FaLock, FaBookOpen } from "react-icons/fa";

const features = [
  {
    icon: FaSyncAlt,
    title: "Update Gratis 1 Tahun",
    desc: "Termasuk semua update tema",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FaHeadset,
    title: "Support 24/7",
    desc: "Siap membantu kapan saja",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: FaBolt,
    title: "Instalasi Mudah",
    desc: "Panduan lengkap tersedia",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: FaLock,
    title: "Garansi 30 Hari",
    desc: "Jaminan uang kembali",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: FaBookOpen,
    title: "Dokumentasi Lengkap",
    desc: "Docs & changelog update",
    gradient: "from-indigo-500 to-blue-500",
  },
];

export const FeaturesStrip: React.FC = () => {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col items-center text-center p-5 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-100"
            >
              {/* Icon with gradient background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <f.icon size={28} className="text-white" />
              </div>
              
              {/* Text - Larger fonts */}
              <h3 className="text-base font-bold text-[#1a1a2e] mb-1.5 leading-tight">
                {f.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesStrip;
