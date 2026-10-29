"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { cn } from "@/lib/cn";
import { eventFilters } from "@/lib/events";
import type { EventItem } from "@/sanity/lib/queries";

const PAGE = 3;
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const monthName = (y: number, m: number) => new Date(Date.UTC(y, m, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const lagosToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());

/** Every day an event covers, as YYYY-MM-DD */
function eventDays(e: EventItem) {
  const days: string[] = [];
  const end = new Date(`${e.endDate ?? e.startDate}T00:00:00Z`);
  for (let d = new Date(`${e.startDate}T00:00:00Z`); d <= end && days.length < 31; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

/** Calendar + filterable list on the dark Events page. */
export function EventsExplorer({ events }: { events: EventItem[] }) {
  const first = events[0]?.startDate ?? lagosToday();
  const [month, setMonth] = useState({ y: Number(first.slice(0, 4)), m: Number(first.slice(5, 7)) - 1 });
  const [filter, setFilter] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const today = lagosToday();

  const byDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const e of events) for (const d of eventDays(e)) map.set(d, [...(map.get(d) ?? []), e]);
    return map;
  }, [events]);

  const filtered = useMemo(() => {
    const cats = eventFilters[filter].categories;
    return events.filter((e) => (!cats || (e.category && cats.includes(e.category))) && (!day || eventDays(e).includes(day)));
  }, [events, filter, day]);

  const firstWeekday = new Date(Date.UTC(month.y, month.m, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
  const prevMonthDays = new Date(Date.UTC(month.y, month.m, 0)).getUTCDate();
  const shift = (delta: number) => {
    const d = new Date(Date.UTC(month.y, month.m + delta, 1));
    setMonth({ y: d.getUTCFullYear(), m: d.getUTCMonth() });
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[387px_1fr] lg:gap-0">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-3xl leading-9 font-bold tracking-[-0.025em] text-white">{monthName(month.y, month.m)}</h2>
          <div className="flex gap-3">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="transition-opacity hover:opacity-80">
              <Image src="/icons/events/prev.svg" alt="" width={48} height={48} />
            </button>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="transition-opacity hover:opacity-80">
              <Image src="/icons/events/next.svg" alt="" width={48} height={48} />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-outline/10 bg-[#1a1b2d] p-5 shadow-[0_25px_50px_rgb(0_0_0/0.25)] sm:p-8">
          <div className="grid grid-cols-7 gap-x-2 pb-6 sm:gap-x-4">
            {WEEKDAYS.map((w, i) => (
              <span key={i} className="text-center text-sm leading-5 font-medium tracking-[0.1em] text-[#77768a] uppercase">
                {w}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-x-2 gap-y-4 sm:gap-x-2">
            {Array.from({ length: firstWeekday }, (_, i) => (
              <span key={`p${i}`} className="py-2 text-center text-lg leading-7 text-[#e4e1e6] opacity-30">
                {prevMonthDays - firstWeekday + i + 1}
              </span>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date = iso(month.y, month.m, i + 1);
              const dayEvents = byDay.get(date);
              const category = dayEvents?.[0]?.category;
              const selected = day === date;
              const isToday = date === today;
              return (
                <button
                  key={date}
                  type="button"
                  disabled={!dayEvents}
                  onClick={() => {
                    setDay(selected ? null : date);
                    setVisible(PAGE);
                  }}
                  aria-pressed={selected}
                  aria-label={dayEvents ? `${date}: ${dayEvents.map((e) => e.title).join(", ")}` : undefined}
                  className={cn(
                    "relative flex flex-col items-center rounded-xl py-2 text-lg leading-7 text-[#e4e1e6] transition-colors",
                    dayEvents && "border border-[#e0e0ff]/20 bg-navy/30 font-bold text-[#bec2fd] hover:bg-navy",
                    dayEvents && category === "specialService" && "border-[#e0e0ff]/30 bg-navy text-white",
                    (selected || (isToday && !day)) && "border-transparent bg-gold font-bold text-ink shadow-[0_4px_6px_rgb(204_168_48/0.2),0_10px_15px_rgb(204_168_48/0.2)] hover:bg-gold",
                  )}
                >
                  {i + 1}
                  {dayEvents && !selected && (
                    <span
                      className={cn(
                        "absolute bottom-1 size-1.5 rounded-full",
                        category === "specialService" ? "bg-butter" : category === "conference" ? "bg-white" : "bg-gold",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-6">
          {eventFilters.map((f, i) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                setFilter(i);
                setVisible(PAGE);
              }}
              className={cn(
                "rounded-full px-6 py-2.5 leading-6 transition-colors",
                filter === i
                  ? "bg-gold font-bold text-ink shadow-[0_4px_6px_rgb(204_168_48/0.2),0_10px_15px_rgb(204_168_48/0.2)]"
                  : "border border-outline/20 bg-[#1a1b2d] text-[#e4e1e6] hover:border-outline/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:border-l lg:border-outline/10 lg:pl-12">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-3xl leading-9 font-bold tracking-[-0.025em] text-white">
            {day ? new Date(`${day}T00:00:00Z`).toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : "Upcoming"}
          </h2>
          {day ? (
            <button type="button" onClick={() => setDay(null)} className="text-sm leading-5 tracking-[0.1em] text-butter uppercase hover:underline">
              Show all
            </button>
          ) : (
            <Link href="/events/upcoming" className="text-sm leading-5 tracking-[0.1em] text-butter uppercase hover:underline">
              View all
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl bg-[#1a1b2d] p-8 text-center text-[#9a9bb0]">No events match this filter yet.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {filtered.slice(0, visible).map((e) => (
              <EventListItem key={e._id} event={e} />
            ))}
          </ul>
        )}

        {visible < filtered.length && (
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE)}
              className="rounded-full border border-gold px-10 py-4 leading-4 font-semibold tracking-[0.1em] text-butter uppercase transition-colors hover:bg-gold/10"
            >
              Load More Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function EventListItem({ event: e }: { event: EventItem }) {
  const date = new Date(`${e.startDate}T00:00:00Z`);
  const category = e.label ?? (e.category ? { sundayService: "Sunday Service", specialService: "Special Event", conference: "Conference", community: "Community" }[e.category] : null);

  return (
    <li className="flex gap-6 rounded-2xl border border-outline/5 bg-[#1a1b2d] p-6 shadow-[0_8px_10px_rgb(0_0_0/0.1),0_20px_25px_rgb(0_0_0/0.1)] sm:gap-8">
      <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-xl border border-outline/10 bg-[#000114] text-white shadow-[0_2px_4px_rgb(0_0_0/0.05)] sm:size-24">
        <span className="text-sm leading-5 font-bold tracking-[0.1em] uppercase">{date.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}</span>
        <span className="pt-1 text-3xl leading-[30px] font-bold">{date.getUTCDate()}</span>
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pb-2">
          {category && <span className="text-xs leading-4 font-bold tracking-[0.1em] text-butter uppercase">{category}</span>}
          {category && e.timeLabel && <span className="text-xs text-outline/30">•</span>}
          {e.timeLabel && (
            <span className="flex items-center gap-1.5 text-sm leading-5 text-[#9a9bb0]">
              <Image src="/icons/events/clock-dark.svg" alt="" width={11.667} height={11.667} />
              {e.timeLabel}
            </span>
          )}
        </p>
        <h3 className="pb-3 text-2xl leading-8 font-bold text-white">
          <Link href={`/events/${e.slug}`} className="hover:underline">
            {e.title}
          </Link>
        </h3>
        {e.summary && <p className="pb-6 leading-6 text-[#9a9bb0]">{e.summary}</p>}
        <div className="flex flex-wrap gap-6 text-sm leading-5 tracking-[0.05em] uppercase">
          {e.registrationOpen ? (
            <Link href={`/events/${e.slug}/register`} className="text-butter hover:underline">
              Register now
            </Link>
          ) : (
            <a href={`/events/${e.slug}/calendar`} className="text-white hover:text-butter">
              Add to calendar
            </a>
          )}
          {e.streamUrl && (
            <a href={e.streamUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-butter">
              Stream links
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
