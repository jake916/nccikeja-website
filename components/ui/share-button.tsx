"use client";

import Image from "next/image";
import { useState } from "react";

/** Uses the device share sheet where available, otherwise copies the page link. */
export function ShareButton({ title, icon = { src: "/icons/sermons/share.svg", width: 50, height: 46 } }: {
  title: string;
  icon?: { src: string; width: number; height: number };
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Share sheet dismissed
    }
  }

  return (
    <button type="button" onClick={share} aria-label="Share" className="relative shrink-0 transition-opacity hover:opacity-80">
      <Image src={icon.src} alt="" width={icon.width} height={icon.height} />
      <span role="status" className={`absolute top-full right-0 mt-1 rounded bg-navy px-2 py-1 text-xs whitespace-nowrap text-white transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}>
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}
