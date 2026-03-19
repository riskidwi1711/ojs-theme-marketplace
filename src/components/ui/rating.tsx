import * as React from "react";

export interface RatingProps {
  value: number; // 0..5
  size?: number;
  className?: string;
}

const Star = ({ filled, size }: { filled: boolean; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    className="text-[var(--color-primary)]"
  >
    <path
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0L6.605 16.28c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.97 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
    />
  </svg>
);

const HalfStar = ({ size }: { size: number }) => (
  <div className="relative" style={{ width: size, height: size }}>
    <Star filled={false} size={size} />
    <div className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
      <Star filled={true} size={size} />
    </div>
  </div>
);

export const Rating: React.FC<RatingProps> = ({ value, size = 16, className }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className={["inline-flex items-center gap-0.5", className].join(" ")}> 
      {Array.from({ length: full }).map((_, i) => (
        <Star key={"f" + i} filled={true} size={size} />
      ))}
      {half && <HalfStar size={size} />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={"e" + i} filled={false} size={size} />
      ))}
    </div>
  );
};

export default Rating;

