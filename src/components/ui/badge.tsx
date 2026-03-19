import * as React from "react";

type Variant = "default" | "success" | "warning" | "danger" | "muted";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default:
    "bg-[var(--color-primary-100)] text-[var(--color-foreground)] border border-[var(--color-border)]",
  success: "bg-[var(--color-success)]/10 text-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
  muted: "bg-black/5 dark:bg-white/10 text-[var(--color-foreground)]/80",
};

export const Badge = ({ variant = "default", className = "", ...props }: BadgeProps) => (
  <span
    className={[
      "inline-flex items-center rounded-[var(--radius-full)] px-2.5 py-1 text-[var(--text-xs)] font-medium",
      variants[variant],
      className,
    ].join(" ")}
    {...props}
  />
);

export default Badge;

