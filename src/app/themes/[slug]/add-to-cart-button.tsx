"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart";
import { LuShoppingCart, LuCheck } from "react-icons/lu";
import { parsePrice } from "@/helper/price";

interface Props {
  product: {
    id: string;
    name: string;
    price?: number;
    priceText?: string;
    image?: string;
  };
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    const priceIDR = product.price ?? parsePrice(product.priceText || "");

    addItem({
      id: product.id,
      name: product.name,
      priceIDR,
      image: product.image,
    });

    setAdded(true);
    setTimeout(() => router.push("/checkout"), 600);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={added}
      className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
        added 
          ? "bg-green-500 text-white shadow-green-100" 
          : "bg-gray-900 text-white hover:bg-[var(--color-primary)] hover:text-white shadow-gray-200"
      }`}
    >
      {added ? (
        <>
          <LuCheck size={20} />
          Berhasil Ditambahkan
        </>
      ) : (
        <>
          <LuShoppingCart size={20} />
          Beli Sekarang
        </>
      )}
    </button>
  );
}
