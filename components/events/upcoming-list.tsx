"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { eventFilters } from "@/lib/events";
import type { EventItem } from "@/sanity/lib/queries";

import { EventCard } from "./event-card";

/** All upcoming events grouped by month, with category filters and a grid/list toggle. */
export function UpcomingList({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState(0);
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  const months = useMemo(() => {
    const cats = eventFilters[filter].categories;
    const groups = new Map<string, EventItem[]>();
    for (const e of events) {
      if (cats && !(e.category && cats.includes(e.category))) continue;
      const key = e.startDate.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), e]);
    }
    return [...groups];
  }, [events, filter]);

  return (
    <>
      <div className="sticky top-20 z-20 mb-20 flex flex-wrap items-center justify-between gap-4 border-y border-[#e4e1e6] bg-surface-bright/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-20">
        <div className="flex flex-wrap gap-3">
          {eventFilters.map((f, i) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilter(i)}
              className={cn(
                "rounded-full border px-6 py-1 text-sm leading-5 font-medium transition-colors",
                filter === i ? "border-navy bg-navy text-[#7e83ba]" : "border-outline bg-white text-muted hover:border-navy/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg border border-outline bg-white p-1">
          {(["grid", "list"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLayout(l)}
              aria-pressed={layout === l}
              aria-label={l === "grid" ? "Grid view" : "List view"}
              className={cn("rounded transition-opacity", layout !== l && "opacity-60 hover:opacity-100")}
            >
              <Image src={`/icons/events/${l}-view.svg`} alt="" width={26} height={26} />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-20 px-4 sm:px-6 lg:px-20">
        {months.length === 0 && <p className="rounded-xl border border-outline/30 bg-white p-8 text-center text-muted">No upcoming events in this category.</p>}
        {months.map(([key, items]) => (
          <section key={key} className="flex flex-col gap-12">
            <h2 className="text-2xl leading-8 font-semibold text-ink">
              {new Date(`${key}-01T00:00:00Z`).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}
            </h2>
            <ul className={cn("grid gap-6", layout === "grid" && "sm:grid-cols-2 lg:grid-cols-3")}>
              {items.map((e) => (
                <li key={e._id}>
                  <EventCard event={e} layout={layout} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
