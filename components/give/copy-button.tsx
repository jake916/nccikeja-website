"use client";

import Image from "next/image";
import { useState } from "react";

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); the number is still selectable on screen.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label} account number`}
      className="relative flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-gold"
    >
      <Image src="/icons/copy.svg" alt="" width={12.75} height={15} />
      <span
        role="status"
        className={`pointer-events-none absolute -top-7 right-0 rounded bg-navy px-2 py-1 text-xs whitespace-nowrap text-white transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}
      >
        {copied ? "Copied!" : ""}
      </span>
    </button>
  );
}
