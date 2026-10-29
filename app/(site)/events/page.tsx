import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EventsExplorer } from "@/components/events/events-explorer";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { getEvents, getListingPage } from "@/lib/content";
import { cn } from "@/lib/cn";
import { formatDayTime } from "@/lib/format";
import type { EventItem } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Events",
  description: "Services, conferences and community gatherings at New Covenant Church, Ikeja.",
};

export default async function EventsPage() {
  const [page, events] = await Promise.all([getListingPage("eventsPage"), getEvents()]);
  // The large card goes to the featured special service, if there is one
  const featured = events
    .filter((e) => e.featured)
    .sort((a, b) => Number(b.category === "specialService") - Number(a.category === "specialService"))
    .slice(0, 3);

  return (
    <div className="bg-[#000114] pb-20">
      <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-6 pt-20 pb-40 lg:h-[700px] lg:pt-[193px] lg:pb-[209px]">
        <CmsImage image={page?.heroImage} alt="" sizes="100vw" preload className="scale-105 object-cover" />
        <div className="absolute inset-0 bg-linear-to-b from-ink/80 via-ink/60 to-[#000114]" />
        <div className="relative flex max-w-[804px] flex-col items-center gap-3 text-center">
          <span className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/20 px-4 py-1.5 backdrop-blur-md">
            <Image src="/icons/events/calendar-tag.svg" alt="" width={10.5} height={11.667} />
            <span className="text-sm leading-5 font-medium tracking-[0.05em] text-butter uppercase">Church Calendar</span>
          </span>
          <h1 className="pb-6 text-[44px] leading-[56px] font-bold tracking-[-0.012em] text-white drop-shadow-[0_25px_25px_rgb(0_0_0/0.15)] sm:text-6xl sm:leading-[80px]">
            {page?.heroHeading ?? "Upcoming Events"}
          </h1>
          {page?.heroText && <p className="text-lg leading-7 text-[#bec2fd] sm:text-[25px]">{page.heroText}</p>}
        </div>
      </section>

      {featured.length > 0 && (
        <Container className="relative -mt-28 max-w-[1280px] lg:px-[120px]">
          <div className="grid gap-6 lg:grid-cols-[685px_1fr]">
            <FeaturedLarge event={featured[0]} />
            {featured.length > 1 && (
              <div className="flex flex-col gap-6">
                {featured.slice(1).map((e, i) => (
                  <FeaturedSmall key={e._id} event={e} tone={i === 0 ? "gold" : "navy"} />
                ))}
              </div>
            )}
          </div>
        </Container>
      )}

      <Container className="pt-20 lg:px-[120px] lg:pt-[164px]">
        <EventsExplorer events={events} />
      </Container>
    </div>
  );
}

function FeaturedLarge({ event: e }: { event: EventItem }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-outline/10 bg-[#1a1b2d] shadow-[0_25px_50px_rgb(0_0_0/0.25)]">
      <div className="relative h-60 sm:h-80">
        <CmsImage image={e.image} alt="" sizes="(min-width: 1024px) 685px, 100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-[#000114] to-[#000114]/0" />
        <span className="absolute bottom-6 left-6 rounded-full bg-gold px-4 py-1.5 text-sm leading-5 font-bold tracking-[0.01em] text-ink shadow-[0_4px_6px_rgb(0_0_0/0.1),0_10px_15px_rgb(0_0_0/0.1)]">
          {e.label ?? "Featured"}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-8">
        <div>
          <p className="flex items-center gap-2 pb-3 text-sm leading-5 font-medium tracking-[0.01em] text-[#e9c349]">
            <Image src="/icons/events/calendar-gold.svg" alt="" width={12} height={13.333} />
            {formatDayTime(e.startDate, e.startTime)}
          </p>
          <h2 className="pb-4 text-[30px] leading-9 text-white">{e.title}</h2>
          {e.summary && <p className="line-clamp-2 mb-8 text-lg leading-7 text-[#9a9bb0]">{e.summary}</p>}
        </div>
        <Link href={`/events/${e.slug}`} className="flex items-center gap-2 self-start text-sm leading-5 font-semibold tracking-[0.1em] text-butter uppercase hover:underline">
          Discover more
          <Image src="/icons/events/arrow-gold.svg" alt="" width={9.333} height={9.333} />
        </Link>
      </div>
    </article>
  );
}

function FeaturedSmall({ event: e, tone }: { event: EventItem; tone: "gold" | "navy" }) {
  const date = new Date(`${e.startDate}T00:00:00Z`);
  const gold = tone === "gold";

  return (
    <article
      className={cn(
        "relative flex min-h-[288px] flex-col justify-center overflow-hidden rounded-2xl border p-8 shadow-[0_8px_10px_rgb(0_0_0/0.1),0_20px_25px_rgb(0_0_0/0.1)]",
        gold ? "border-outline/10 bg-[#1a1b2d]" : "border-[#e0e0ff]/10 bg-navy",
      )}
    >
      {gold ? (
        <div aria-hidden className="absolute inset-0 bg-linear-to-br from-navy to-[#000114] opacity-50" />
      ) : (
        <>
          <CmsImage image={e.image} alt="" sizes="330px" className="object-cover opacity-10" />
          <Image src="/icons/events/community.svg" alt="" width={84} height={82} className="absolute top-6 right-6" />
        </>
      )}
      <div className="relative">
        <div
          className={cn(
            "mb-6 flex size-16 flex-col items-center justify-center rounded-xl border font-bold",
            gold ? "border-gold/20 bg-gold/10 text-butter" : "border-white/10 bg-white/5 text-[#e0e0ff] backdrop-blur-sm",
          )}
        >
          <span className="text-sm leading-5 uppercase">{date.toLocaleString("en-US", { month: "short", timeZone: "UTC" })}</span>
          <span className="text-2xl leading-6">{date.getUTCDate()}</span>
        </div>
        <h2 className="pb-3 text-2xl leading-[30px] text-white">{e.title}</h2>
        {e.summary && <p className={cn("line-clamp-2 mb-6 leading-6", gold ? "text-[#9a9bb0]" : "text-[#bec2fd] opacity-80")}>{e.summary}</p>}
        <Link
          href={`/events/${e.slug}`}
          className={cn("flex items-center gap-2 text-sm leading-5 tracking-[0.1em] uppercase hover:underline", gold ? "text-butter" : "text-[#bec2fd]")}
        >
          Details
          <Image src={gold ? "/icons/events/arrow-sm.svg" : "/icons/events/arrow-light.svg"} alt="" width={8} height={8} />
        </Link>
      </div>
    </article>
  );
}
