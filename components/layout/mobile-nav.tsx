"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { isActivePath, type NavItem, type NavLink } from "@/lib/navigation";

/** Per-row delay (ms) for the stagger in, and the quicker reverse stagger out. */
const STAGGER_IN = 45;
const STAGGER_OUT = 25;
const ROW_DURATION = 300;

type Row =
  | { kind: "heading"; label: string }
  | { kind: "link"; label: string; href: string; child: boolean };

/** Flattens the nav so every visible row gets its own place in the stagger. */
function toRows(links: NavItem[]): Row[] {
  return links.flatMap<Row>((link) =>
    link.children
      ? [
          { kind: "heading", label: link.label },
          ...link.children.map((child) => ({ kind: "link" as const, label: child.label, href: child.href, child: true })),
        ]
      : [{ kind: "link", label: link.label, href: link.href, child: false }],
  );
}

export function MobileNav({ links, cta }: { links: NavItem[]; cta: NavLink }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => setOpen(false);

  const rows = toRows(links);
  const count = rows.length + 1; // + the Give button
  const delay = (i: number) => `${open ? i * STAGGER_IN : (count - 1 - i) * STAGGER_OUT}ms`;
  // The panel waits for the rows to finish leaving before it fades out.
  const panelDelay = open ? "0ms" : `${(count - 1) * STAGGER_OUT + ROW_DURATION}ms`;

  // Lock the page behind the menu, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const rowClass = cn(
    "transition-[opacity,translate] duration-300 ease-out motion-reduce:transition-none",
    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full text-white hover:bg-white/10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M4 9h16M4 15h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {/* The header's backdrop-blur makes it the containing block, so the panel is sized off it rather than fixed. */}
      <nav
        id="mobile-menu"
        aria-label="Main"
        inert={!open}
        style={{ transitionDelay: panelDelay }}
        className={cn(
          "absolute inset-x-0 top-full flex h-[calc(100dvh-5rem)] flex-col border-t border-white/10 bg-ink",
          "transition-[opacity,visibility] duration-200 motion-reduce:transition-none",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-4 sm:px-6">
          {rows.map((row, i) => (
            <li key={row.kind === "link" ? row.href : row.label} style={{ transitionDelay: delay(i) }} className={rowClass}>
              {row.kind === "heading" ? (
                <span className="block py-3 text-base font-medium text-white/60">{row.label}</span>
              ) : row.child ? (
                <Link
                  href={row.href}
                  onClick={close}
                  aria-current={isActivePath(pathname, row.href) ? "page" : undefined}
                  className="block border-l border-white/15 py-2 pl-4 text-sm font-medium text-white/90 hover:text-gold aria-[current=page]:border-gold aria-[current=page]:text-gold"
                >
                  {row.label}
                </Link>
              ) : (
                <Link
                  href={row.href}
                  onClick={close}
                  aria-current={isActivePath(pathname, row.href) ? "page" : undefined}
                  className="block py-3 text-base font-medium text-white/90 hover:text-gold aria-[current=page]:text-gold"
                >
                  {row.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <div
          style={{ transitionDelay: delay(count - 1) }}
          className={cn(rowClass, "border-t border-white/10 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6")}
        >
          <Link href={cta.href} onClick={close} className={cn(buttonClasses({ size: "md" }), "w-full")}>
            {cta.label}
          </Link>
        </div>
      </nav>
    </div>
  );
}
