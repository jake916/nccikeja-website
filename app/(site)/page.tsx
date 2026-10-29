import { ConnectSection } from "@/components/home/connect-section";
import { EventsSection } from "@/components/home/events-section";
import { HomeHero } from "@/components/home/home-hero";
import { OnlineCta } from "@/components/home/online-cta";
import { ResourcesSection } from "@/components/home/resources-section";
import { SermonHighlight } from "@/components/home/sermon-highlight";
import { TestimonySection } from "@/components/home/testimony-section";
import { WelcomeSection } from "@/components/home/welcome-section";
import { getHomePage, getUpcomingEvents } from "@/lib/content";
import type { HomePageData } from "@/sanity/lib/queries";

export default async function HomePage() {
  const [data, events] = await Promise.all([getHomePage(), getUpcomingEvents()]);
  const page: Partial<HomePageData> = data ?? {};

  return (
    <>
      <HomeHero heading={page.heroHeading ?? null} subheading={page.heroSubheading ?? null} images={page.heroImages ?? []} />
      <WelcomeSection
        content={{
          welcomeHeading: page.welcomeHeading ?? null,
          welcomeText: page.welcomeText ?? null,
          vision: page.vision ?? null,
          mission: page.mission ?? null,
          welcomeImage: page.welcomeImage ?? null,
          welcomeImageCaption: page.welcomeImageCaption ?? null,
          welcomeImageSubcaption: page.welcomeImageSubcaption ?? null,
        }}
      />
      <ConnectSection inPersonImage={page.inPersonImage ?? null} />
      <SermonHighlight image={page.sermonImage ?? null} href={page.sermonVideoUrl ?? "/resources/sermons"} />
      <TestimonySection image={page.testimonyImage ?? null} videoUrl={page.testimonyVideoUrl ?? null} />
      <ResourcesSection />
      <EventsSection events={events} />
      <OnlineCta />
    </>
  );
}
