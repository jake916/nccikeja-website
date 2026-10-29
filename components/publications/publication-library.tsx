"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { libraryTabs } from "@/lib/publications";
import type { PublicationSummary } from "@/sanity/lib/queries";

import { CompactPublicationCard, FeaturedPublicationCard, WidePublicationCard } from "./publication-cards";

const MORE = 4;

/**
 * The resource library: search + type tabs. Unfiltered, it shows the design's bento layout
 * (featured book, two compact cards, then wide cards); filtered, a simple grid of results.
 */
export function PublicationLibrary({ items }: { items: PublicationSummary[] }) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(0);
  const [extra, setExtra] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const kinds = libraryTabs[tab].kinds;
    return items.filter(
      (item) =>
        (!kinds || kinds.includes(item.kind)) &&
        (!q || [item.title, item.excerpt, item.category].some((v) => v?.toLowerCase().includes(q))),
    );
  }, [items, query, tab]);

  const bento = tab === 0 && !query.trim();
  const [featured, ...rest] = filtered;
  const compact = bento ? rest.slice(0, 2) : [];
  const wide = bento ? rest.slice(2) : filtered;
  const visibleWide = wide.slice(0, (bento ? 2 : 6) + extra);

  return (
    <div className="flex flex-col gap-12">
      <div className="mx-auto flex w-full max-w-[768px] flex-col gap-3 rounded-lg border border-outline bg-surface-bright p-3 shadow-[0_8px_20px_rgb(21_26_75/0.04)] sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search resources</span>
          <Image src="/icons/publications/search.svg" alt="" width={18} height={24} className="pointer-events-none absolute top-3 left-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setExtra(0);
            }}
            placeholder="Search resources..."
            className="h-12 w-full rounded bg-white pr-3 pl-20 leading-5 text-body placeholder:text-outline focus:outline-2 focus:outline-navy"
          />
        </label>
        <div role="tablist" aria-label="Resource type" className="flex gap-3 overflow-x-auto">
          {libraryTabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={tab === i}
              onClick={() => {
                setTab(i);
                setExtra(0);
              }}
              className={cn(
                "h-12 shrink-0 rounded px-6 text-sm leading-5 font-medium tracking-[0.01em] whitespace-nowrap transition-colors",
                tab === i ? "bg-navy text-[#7e83ba]" : "border border-outline text-muted hover:bg-surface",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-outline/30 bg-white p-8 text-center text-muted">No resources match your search.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {bento && featured && (
            <div className="grid gap-6 lg:grid-cols-[760px_1fr]">
              <FeaturedPublicationCard item={featured} />
              <div className="grid gap-6 lg:grid-rows-[238px_270px]">
                {compact.map((item) => (
                  <CompactPublicationCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}
          {visibleWide.length > 0 && (
            <ul className="grid gap-6 md:grid-cols-2">
              {visibleWide.map((item) => (
                <li key={item._id}>
                  <WidePublicationCard item={item} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {visibleWide.length < wide.length && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={() => setExtra((n) => n + MORE)}
            className="rounded border border-subtle px-12 py-3 text-sm leading-4 font-semibold tracking-[0.02em] text-body transition-colors hover:bg-surface"
          >
            Load More Resources
          </button>
        </div>
      )}
    </div>
  );
}
