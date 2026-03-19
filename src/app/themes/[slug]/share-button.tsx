"use client";
import * as React from "react";
import { LuShare2, LuCheck } from "react-icons/lu";

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/themes/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available — nothing to do
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors"
    >
      {copied ? (
        <>
          <LuCheck size={15} className="text-green-500" />
          <span className="text-green-500">Disalin!</span>
        </>
      ) : (
        <>
          <LuShare2 size={15} />
          Bagikan
        </>
      )}
    </button>
  );
}
