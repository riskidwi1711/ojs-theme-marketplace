"use client";
import * as React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-[var(--radius-md)] disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[var(--text-sm)]",
  md: "h-11 px-4 text-[var(--text-sm)]",
  lg: "h-12 px-6 text-[var(--text-base)]",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-black hover:bg-[var(--color-primary-600)]/95 hover:text-black ring-[var(--color-primary-100)]",
  secondary:
    "bg-[var(--color-primary-100)] text-[var(--color-foreground)] hover:bg-[var(--color-primary-100)]/70",
  outline:
    "border border-[var(--color-border)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
  ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
  danger:
    "bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", leftIcon, rightIcon, fullWidth, className = "", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={[
          base,
          sizes[size],
          variants[variant],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...props}
      >
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;

