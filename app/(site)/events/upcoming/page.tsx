import type { Metadata } from "next";

import { HeaderBackdrop } from "@/components/layout/header-backdrop";
import { UpcomingList } from "@/components/events/upcoming-list";
import { Container } from "@/components/ui/container";
import { getEvents, getListingPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "All Upcoming Events",
  description: "Every upcoming service, conference and community event at New Covenant Church, Ikeja.",
};

export default async function UpcomingEventsPage() {
  const [page, events] = await Promise.all([getListingPage("eventsPage"), getEvents()]);

  return (
    <div className="pb-20">
      <HeaderBackdrop />
      <Container className="max-w-[1280px] px-0 sm:px-0 lg:px-10">
        <header className="flex flex-col gap-3 px-4 pt-14 pb-20 sm:px-6 lg:px-20">
          <h1 className="text-[36px] leading-[44px] font-bold text-ink sm:text-5xl sm:leading-[56px]">{page?.ctaHeading ?? "Upcoming Events"}</h1>
          {page?.ctaText && <p className="max-w-[672px] text-lg leading-7 text-muted">{page.ctaText}</p>}
        </header>
        <UpcomingList events={events} />
      </Container>
    </div>
  );
}
