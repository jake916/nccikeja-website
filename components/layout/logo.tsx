import Image from "next/image";
import Link from "next/link";

import logo from "@/assets/logo.png";
import { cn } from "@/lib/cn";

/** White-on-transparent church logo, linking home. Size it with a height class. */
export function Logo({ className, preload }: { className?: string; preload?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0", className)}>
      <Image
        src={logo}
        alt="New Covenant Church, Ikeja Centre"
        className="h-full w-auto"
        sizes="240px"
        preload={preload}
      />
    </Link>
  );
}
