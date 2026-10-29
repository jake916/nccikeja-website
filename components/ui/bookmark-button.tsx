"use client";

import Image from "next/image";
import { useState } from "react";

/** Browsers don't let pages add bookmarks themselves, so this shows the keyboard shortcut. */
export function BookmarkButton() {
  const [hint, setHint] = useState(false);

  function show() {
    setHint(true);
    setTimeout(() => setHint(false), 3000);
  }

  const shortcut = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘D" : "Ctrl+D";

  return (
    <button type="button" onClick={show} aria-label="Bookmark this page" className="relative transition-opacity hover:opacity-80">
      <Image src="/icons/publications/bookmark-btn.svg" alt="" width={30} height={40} />
      <span role="status" className={`absolute top-full right-0 mt-1 rounded bg-navy px-2 py-1 text-xs whitespace-nowrap text-white transition-opacity ${hint ? "opacity-100" : "opacity-0"}`}>
        {hint ? `Press ${shortcut} to bookmark` : ""}
      </span>
    </button>
  );
}
