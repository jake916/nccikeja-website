"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

/** Routes whose design uses a solid ink header instead of the see-through one. */
const SOLID_ROUTES = [
  /^\/resources\/sermons/,
  /^\/resources\/publications\/.+/,
  /^\/online-church/,
  /^\/connect/,
  /^\/events\/upcoming/,
  /^\/events\/[^/]+\/register/,
];

/** Fixed header: see-through over the hero, solid navy once the page is scrolled. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || SOLID_ROUTES.some((route) => route.test(pathname));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 backdrop-blur-[6px] transition-[background-color,box-shadow] duration-300",
        solid ? "bg-ink" : "bg-black/10",
        scrolled && "shadow-[0_4px_20px_rgb(0_0_0/0.15)]",
      )}
    >
      {children}
    </header>
  );
}
