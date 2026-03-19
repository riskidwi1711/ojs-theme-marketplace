import * as React from "react";

export interface CategoryChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

export const CategoryChip = ({ active, icon, className = "", children, ...props }: CategoryChipProps) => (
  <button
    className={[
      "inline-flex items-center gap-2 rounded-[var(--radius-full)] border px-3 py-2 text-[var(--text-sm)]",
      active
        ? "border-transparent bg-[var(--color-primary-100)] text-[var(--color-foreground)]"
        : "border-[var(--color-border)] bg-white hover:bg-black/5",
      "transition-colors",
      className,
    ].join(" ")}
    {...props}
  >
    {icon}
    <span>{children}</span>
  </button>
);

export default CategoryChip;

