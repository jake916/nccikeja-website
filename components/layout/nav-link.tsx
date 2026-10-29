"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { isActivePath, type NavLink } from "@/lib/navigation";

/** Header link that turns gold on its own page (and the pages beneath it). */
export function HeaderNavLink({ link, className }: { link: NavLink; className: string }) {
  const pathname = usePathname();

  return (
    <Link
      href={link.href}
      aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
      className={cn(className, "aria-[current=page]:text-gold")}
    >
      {link.label}
    </Link>
  );
}
