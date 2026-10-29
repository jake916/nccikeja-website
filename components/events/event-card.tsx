import Image from "next/image";
import Link from "next/link";

import { CmsImage } from "@/components/ui/cms-image";
import { cn } from "@/lib/cn";
import type { EventItem } from "@/sanity/lib/queries";

/** Light event card with date badge, used on All Upcoming Events. */
export function EventCard({ event: e, layout = "grid" }: { event: EventItem; layout?: "grid" | "list" }) {
  const date = new Date(`${e.startDate}T00:00:00Z`);
  const badge = e.label ?? (e.category === "specialService" ? "Special Service" : null);
  const meta = e.venue && !e.timeLabel ? { icon: "/icons/events/pin.svg", w: 12, text: e.venue } : { icon: "/icons/events/clock.svg", w: 15, text: e.timeLabel };

  return (
    <article
      className={cn(
        "flex overflow-hidden rounded-xl border border-outline bg-white shadow-[0_8px_20px_rgb(21_26_75/0.04)]",
        layout === "grid" ? "h-full flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div className={cn("relative bg-surface-container", layout === "grid" ? "h-64" : "h-56 sm:h-auto sm:w-80 sm:shrink-0")}>
        <CmsImage image={e.image} alt="" sizes="(min-width: 1024px) 330px, 100vw" />
        <span className="absolute top-3 left-3 flex flex-col items-center rounded bg-white/90 px-3 py-1 shadow-[0_1px_2px_rgb(0_0_0/0.05)] backdrop-blur-md">
          <span className="text-xs leading-4 font-bold text-brand-red uppercase">{date.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}</span>
          <span className="text-lg leading-7 font-medium text-ink">{String(date.getUTCDate()).padStart(2, "0")}</span>
        </span>
        {badge && <span className="absolute top-3 right-3 rounded-full bg-gold px-3 py-1 text-xs leading-4 font-bold text-[#4f3e00]">{badge}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        {meta.text && (
          <p className="flex items-center gap-1.5 pb-3 text-sm leading-5 font-medium text-muted">
            <Image src={meta.icon} alt="" width={meta.w} height={15} />
            {meta.text}
          </p>
        )}
        <h3 className="pb-3 text-xl leading-[25px] text-body">{e.title}</h3>
        {e.summary && <p className="line-clamp-2 mb-6 leading-6 text-muted">{e.summary}</p>}
        <Link
          href={`/events/${e.slug}`}
          className="mt-auto block rounded-full border border-ink py-3 text-center leading-4 font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Learn More
        </Link>
      </div>
    </article>
  );
}
