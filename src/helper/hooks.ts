import * as React from "react";

export function useCountdownToMidnight() {
  const getSecsLeft = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
  };

  const [secs, setSecs] = React.useState<number | null>(null);

  React.useEffect(() => {
    setSecs(getSecsLeft());
    const id = setInterval(() => setSecs(getSecsLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (secs === null) return ["--", "--", "--"];
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return [h, m, s];
}
