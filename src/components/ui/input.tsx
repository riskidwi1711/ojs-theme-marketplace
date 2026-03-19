import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={[
        "h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3 text-[var(--text-sm)]",
        "placeholder:text-black/40 dark:placeholder:text-white/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
        className,
      ].join(" ")}
      {...props}
    />
  )
);

Input.displayName = "Input";

export default Input;

