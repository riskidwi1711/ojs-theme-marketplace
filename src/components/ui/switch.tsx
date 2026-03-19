"use client";
import * as React from "react";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, disabled }) => {
  const [internal, setInternal] = React.useState(!!checked);
  const isControlled = typeof checked === "boolean";
  const value = isControlled ? checked! : internal;
  const toggle = () => {
    if (disabled) return;
    if (isControlled) onCheckedChange?.(!checked);
    else {
      setInternal((v) => {
        const next = !v;
        onCheckedChange?.(next);
        return next;
      });
    }
  };

  return (
    <button
      type="button"
      aria-pressed={value}
      onClick={toggle}
      disabled={disabled}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-[var(--radius-full)] transition-colors",
        value ? "bg-[var(--color-primary)]" : "bg-black/20 dark:bg-white/25",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          value ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
};

export default Switch;

