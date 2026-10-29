"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { SelectControl } from "@/components/forms/select-control";
import type { SermonSummary } from "@/sanity/lib/queries";

import { SermonCard } from "./sermon-card";

const PAGE_SIZE = 9;

/** Searchable, filterable sermon grid with "Load More". Filtering happens in the browser. */
export function SermonLibrary({ sermons }: { sermons: SermonSummary[] }) {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [year, setYear] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const options = useMemo(() => {
    const unique = (values: (string | null)[]) => [...new Set(values.filter(Boolean) as string[])];
    return {
      series: unique(sermons.map((s) => s.series)).sort(),
      speakers: unique(sermons.map((s) => s.speaker)).sort(),
      years: unique(sermons.map((s) => s.date.slice(0, 4))),
    };
  }, [sermons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sermons.filter(
      (s) =>
        (!q || [s.title, s.series, s.speaker].some((v) => v?.toLowerCase().includes(q))) &&
        (!series || s.series === series) &&
        (!speaker || s.speaker === speaker) &&
        (!year || s.date.startsWith(year)),
    );
  }, [sermons, query, series, speaker, year]);

  // Any filter change starts the list from the top again
  const update = (set: (v: string) => void) => (value: string) => {
    set(value);
    setVisible(PAGE_SIZE);
  };

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-col gap-4 rounded-lg border border-surface-dim bg-white p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05)] lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <label className="relative block w-full lg:max-w-[600px] lg:flex-1">
          <span className="sr-only">Search sermons</span>
          <Image src="/icons/sermons/search.svg" alt="" width={18} height={24} className="pointer-events-none absolute top-[13px] left-4" />
          <input
            type="search"
            value={query}
            onChange={(e) => update(setQuery)(e.target.value)}
            placeholder="Search sermons..."
            className="h-[50px] w-full rounded-full border border-outline bg-surface-bright pr-4 pl-12 leading-5 text-body placeholder:text-[#6b7280] focus:border-navy focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-3 lg:flex-nowrap">
          <FilterSelect label="Series" value={series} onChange={update(setSeries)} placeholder="All Series" options={options.series} />
          <FilterSelect label="Speaker" value={speaker} onChange={update(setSpeaker)} placeholder="All Speakers" options={options.speakers} />
          <FilterSelect label="Year" value={year} onChange={update(setYear)} placeholder="All Years" options={options.years} />
        </div>
      </div>

      {filtered.length > 0 ? (
        <ul className="grid gap-x-12 gap-y-[54px] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, visible).map((sermon) => (
            <li key={sermon._id} className="flex *:w-full">
              <SermonCard sermon={sermon} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-outline/30 bg-white p-8 text-center text-muted">No sermons match your search.</p>
      )}

      {visible < filtered.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border-2 border-ink px-8 py-3 leading-4 font-semibold tracking-[0.02em] text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Load More Sermons
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <SelectControl
      label={label}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      options={[{ value: "", label: placeholder }, ...options.map((option) => ({ value: option, label: option }))]}
      className="h-[38px] rounded-full border border-outline bg-surface-bright py-2 pl-4 text-sm leading-5 font-medium tracking-[0.01em] whitespace-nowrap text-body focus:border-navy focus:outline-none"
      placeholderClassName=""
      menuClassName="w-max max-w-[min(18rem,calc(100vw-3rem))] rounded-xl border-outline"
      optionClassName="px-4 py-2 text-sm leading-5 text-body"
      chevron={{ src: "/icons/sermons/chevron.svg", width: 10, height: 10, className: "top-[16px] right-[14px]" }}
    />
  );
}
