"use client";

import { useEffect } from "react";

interface Props {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export default function RecentlyViewedTracker({ id, name, slug, image }: Props) {
  useEffect(() => {
    try {
      const MAX = 6;
      const saved = localStorage.getItem("recently_viewed");
      const items: { id: string; name: string; slug: string; image?: string }[] = saved ? JSON.parse(saved) : [];
      const filtered = items.filter((i) => i.id !== id);
      filtered.unshift({ id, name, slug, image });
      localStorage.setItem("recently_viewed", JSON.stringify(filtered.slice(0, MAX)));
    } catch { /* ignore */ }
  }, [id, name, slug, image]);

  return null;
}
