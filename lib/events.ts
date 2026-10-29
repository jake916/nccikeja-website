export type EventCategory = "sundayService" | "specialService" | "conference" | "community";

export const categoryLabels: Record<EventCategory, string> = {
  sundayService: "Sunday Service",
  specialService: "Special Service",
  conference: "Conference",
  community: "Community",
};

/** Filter pills shared by the events pages. */
export const eventFilters: { label: string; categories: EventCategory[] | null }[] = [
  { label: "All Events", categories: null },
  { label: "Sunday Services", categories: ["sundayService"] },
  { label: "Special Services", categories: ["specialService", "conference"] },
  { label: "Community", categories: ["community"] },
];

/** "6:00 PM" → [18, 0]; defaults to 9 AM when the time is missing or unreadable. */
export function parseTime(time?: string | null): [number, number] {
  const match = time?.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return [9, 0];
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return [hours, Number(match[2] ?? 0)];
}

/** "2026-11-20" + "6:00 PM" → "20261120T180000" (local Lagos time for an iCalendar TZID) */
function icsDateTime(date: string, [h, m]: [number, number]) {
  return `${date.replaceAll("-", "")}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
}

const escapeIcs = (text: string) => text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, (c) => `\\${c}`);

/** Builds a single-event .ics file that Google, Apple and Outlook calendars can import. */
export function buildIcs(event: {
  slug: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  startTime?: string | null;
  summary?: string | null;
  location?: string | null;
  url: string;
}) {
  const [h, m] = parseTime(event.startTime);
  const endHour = Math.min(h + 2, 23);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//New Covenant Church Ikeja//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@newcovenantikeja.org`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Africa/Lagos:${icsDateTime(event.startDate, [h, m])}`,
    `DTEND;TZID=Africa/Lagos:${icsDateTime(event.endDate ?? event.startDate, [endHour, m])}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    event.summary && `DESCRIPTION:${escapeIcs(`${event.summary}\n\n${event.url}`)}`,
    event.location && `LOCATION:${escapeIcs(event.location)}`,
    `URL:${event.url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}
