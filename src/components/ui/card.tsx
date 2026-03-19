import * as React from "react";

export const Card = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={[
      "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-card",
      "dark:bg-[color-mix(in_oklab,var(--color-background),black_10%)]",
      className,
    ].join(" ")}
    {...props}
  />
);

export const CardHeader = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={["p-4 border-b border-[var(--color-border)]", className].join(" ")} {...props} />
);

export const CardContent = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={["p-4", className].join(" ")} {...props} />
);

export const CardFooter = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={["p-4 border-t border-[var(--color-border)]", className].join(" ")} {...props} />
);

export default Card;

