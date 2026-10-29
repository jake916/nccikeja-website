import { getEvent } from "@/lib/content";
import { buildIcs } from "@/lib/events";

/** "Add to Calendar": downloads an .ics invite for the event. */
export async function GET(request: Request, { params }: RouteContext<"/events/[slug]/calendar">) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return new Response("Event not found", { status: 404 });

  const ics = buildIcs({
    slug,
    title: event.title,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    summary: event.summary,
    location: [event.venue, event.address].filter(Boolean).join(", "),
    url: new URL(`/events/${slug}`, request.url).toString(),
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
    },
  });
}
