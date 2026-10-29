const timeZone = "Africa/Lagos";

const part = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-NG", { timeZone, ...options }).format(date);

/** "OCT 15 - 17, 2024", "OCT 30 - NOV 2, 2024" or "NOV 5, 2024" */
export function formatEventDate(start: string, end?: string | null) {
  const from = new Date(start);
  const month = part(from, { month: "short" }).toUpperCase();
  const day = part(from, { day: "numeric" });
  const year = part(from, { year: "numeric" });

  if (!end) return `${month} ${day}, ${year}`;

  const to = new Date(end);
  const toMonth = part(to, { month: "short" }).toUpperCase();
  const toDay = part(to, { day: "numeric" });
  const toYear = part(to, { year: "numeric" });

  if (year !== toYear) return `${month} ${day}, ${year} - ${toMonth} ${toDay}, ${toYear}`;
  if (month !== toMonth) return `${month} ${day} - ${toMonth} ${toDay}, ${year}`;
  if (day === toDay) return `${month} ${day}, ${year}`;
  return `${month} ${day} - ${toDay}, ${year}`;
}

/** "Oct 08, 2023" */
export function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, month: "short", day: "2-digit", year: "numeric" }).format(new Date(date));
}

/** "October 22, 2023" */
export function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

/** "Sunday, Nov 12 • 9:00 AM", or "Sun, Nov 12 • 9:00 AM" with `short` */
export function formatDayTime(date: string, time?: string | null, { short = false } = {}) {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: short ? "short" : "long", month: "short", day: "numeric" }).format(
    new Date(`${date}T00:00:00Z`),
  );
  return time ? `${day} • ${time}` : day;
}

/** "Friday, November 20, 2026" */
export function formatFullDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00Z`));
}
