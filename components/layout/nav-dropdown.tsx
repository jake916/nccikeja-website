"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { isActivePath, type NavItem } from "@/lib/navigation";

/**
 * Header menu with child links ("Resources"). Opens on hover or click, and closes when a
 * link is chosen, Escape is pressed, the pointer leaves, or the visitor clicks elsewhere.
 */
export function NavDropdown({ item, className }: { item: NavItem; className: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const active = item.children?.some((child) => isActivePath(pathname, child.href));

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(className, "inline-flex items-center justify-center gap-1.5", (open || active) && "text-gold")}
      >
        {item.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden className={cn("transition-transform duration-200", open && "rotate-180")}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        id={menuId}
        className={cn(
          "absolute top-full left-1/2 w-72 -translate-x-1/2 pt-3 transition-[opacity,visibility] duration-150",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="overflow-hidden rounded-xl border border-white/20 bg-[#fafaf8]/80 py-2 shadow-[0_8px_10px_rgb(0_0_0/0.1),0_20px_25px_rgb(0_0_0/0.1)] backdrop-blur-xl">
          {item.children?.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={() => setOpen(false)}
                aria-current={isActivePath(pathname, child.href) ? "page" : undefined}
                className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-navy/5 aria-[current=page]:bg-navy/5"
              >
                {child.icon && (
                  <span className="flex w-[22px] shrink-0 justify-center">
                    <Image src={child.icon.src} alt="" width={child.icon.width} height={child.icon.height} />
                  </span>
                )}
                <span>
                  <span className="block leading-6 whitespace-nowrap text-navy">{child.label}</span>
                  {child.description && <span className="block text-[10px] leading-[15px] text-muted opacity-70">{child.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
