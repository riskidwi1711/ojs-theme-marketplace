import * as React from "react";

export interface PriceProps {
  value: number;
  currency?: string; // e.g., USD, IDR
  original?: number; // strikethrough original price
  className?: string;
}

export const Price: React.FC<PriceProps> = ({ value, currency = "IDR", original, className }) => {
  const f = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "IDR" ? 0 : 2,
  });
  const isDiscount = original && original > value;
  const percent = isDiscount ? Math.round(((original! - value) / original!) * 100) : null;
  return (
    <div className={["flex items-baseline gap-2", className].join(" ")}> 
      <span className="text-lg font-semibold text-[var(--color-foreground)]">{f.format(value)}</span>
      {isDiscount ? (
        <>
          <span className="text-sm text-black/40 line-through dark:text-white/50">{f.format(original!)}</span>
          {percent !== null && (
            <span className="rounded-[var(--radius-full)] bg-[var(--color-danger)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-danger)]">-{percent}%</span>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Price;
