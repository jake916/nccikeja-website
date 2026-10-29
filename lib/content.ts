import "server-only";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  ACADEMY_COURSES_QUERY,
  EVENT_QUERY,
  EVENT_SLUGS_QUERY,
  EVENTS_QUERY,
  TESTIMONY_PAGE_QUERY,
  ACADEMY_PAGE_QUERY,
  GIVE_PAGE_QUERY,
  HOME_PAGE_QUERY,
  LISTING_PAGE_QUERY,
  ONLINE_CHURCH_PAGE_QUERY,
  PUBLICATION_QUERY,
  PUBLICATION_SLUGS_QUERY,
  PUBLICATIONS_QUERY,
  RECOMMENDED_SERMONS_QUERY,
  SERMON_QUERY,
  SERMON_SLUGS_QUERY,
  SERMONS_QUERY,
  SITE_SETTINGS_QUERY,
  UPCOMING_EVENTS_QUERY,
  WHO_WE_ARE_PAGE_QUERY,
  type AcademyCourse,
  type AcademyPageData,
  type EventDetail,
  type EventItem,
  type TestimonyPageData,
  type EventSummary,
  type GivePageData,
  type HomePageData,
  type ListingPageData,
  type OnlineChurchPageData,
  type PublicationDetail,
  type PublicationSummary,
  type SermonDetail,
  type SermonSummary,
  type SiteSettings,
  type WhoWeArePageData,
} from "@/sanity/lib/queries";

// All editable content lives in Sanity. Each loader is tagged with its document type,
// so the /api/revalidate webhook refreshes pages as soon as an editor publishes.

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] });
}

export async function getHomePage(): Promise<HomePageData | null> {
  return sanityFetch({ query: HOME_PAGE_QUERY, tags: ["homePage"] });
}

export async function getGivePage(): Promise<GivePageData | null> {
  return sanityFetch({ query: GIVE_PAGE_QUERY, tags: ["givePage"] });
}

/** Today in Lagos as YYYY-MM-DD (en-CA's format), matching Sanity `date` fields */
const lagosToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());

export async function getUpcomingEvents(): Promise<EventSummary[]> {
  const today = lagosToday();
  const events: EventSummary[] | null = await sanityFetch({
    query: UPCOMING_EVENTS_QUERY,
    params: { today },
    tags: ["event"],
    // Also refresh hourly so finished events drop off without anyone publishing
    revalidate: 3600,
  });
  return events ?? [];
}

export async function getWhoWeArePage(): Promise<WhoWeArePageData | null> {
  return sanityFetch({ query: WHO_WE_ARE_PAGE_QUERY, tags: ["whoWeArePage"] });
}

export async function getAcademyCourses(): Promise<AcademyCourse[]> {
  const courses: AcademyCourse[] | null = await sanityFetch({ query: ACADEMY_COURSES_QUERY, tags: ["academyCourse"] });
  return courses ?? [];
}

export async function getAcademyPage(): Promise<AcademyPageData | null> {
  return sanityFetch({ query: ACADEMY_PAGE_QUERY, tags: ["academyPage"] });
}

export async function getListingPage(id: "sermonsPage" | "publicationsPage" | "eventsPage"): Promise<ListingPageData | null> {
  return sanityFetch({ query: LISTING_PAGE_QUERY, params: { id }, tags: ["listingPage"] });
}

export async function getSermons(): Promise<SermonSummary[]> {
  return (await sanityFetch({ query: SERMONS_QUERY, tags: ["sermon"] })) ?? [];
}

export async function getSermon(slug: string): Promise<SermonDetail | null> {
  return sanityFetch({ query: SERMON_QUERY, params: { slug }, tags: ["sermon", `sermon:${slug}`] });
}

export async function getRecommendedSermons(slug: string): Promise<SermonSummary[]> {
  return (await sanityFetch({ query: RECOMMENDED_SERMONS_QUERY, params: { slug }, tags: ["sermon"] })) ?? [];
}

export async function getSermonSlugs(): Promise<string[]> {
  return (await sanityFetch({ query: SERMON_SLUGS_QUERY, tags: ["sermon"] })) ?? [];
}

export async function getPublications(): Promise<PublicationSummary[]> {
  return (await sanityFetch({ query: PUBLICATIONS_QUERY, tags: ["publication"] })) ?? [];
}

export async function getPublication(slug: string): Promise<PublicationDetail | null> {
  return sanityFetch({ query: PUBLICATION_QUERY, params: { slug }, tags: ["publication", `publication:${slug}`] });
}

export async function getPublicationSlugs(): Promise<string[]> {
  return (await sanityFetch({ query: PUBLICATION_SLUGS_QUERY, tags: ["publication"] })) ?? [];
}

export async function getOnlineChurchPage(): Promise<OnlineChurchPageData | null> {
  return sanityFetch({ query: ONLINE_CHURCH_PAGE_QUERY, tags: ["onlineChurchPage"] });
}

export async function getEvents(): Promise<EventItem[]> {
  const events: EventItem[] | null = await sanityFetch({ query: EVENTS_QUERY, params: { today: lagosToday() }, tags: ["event"], revalidate: 3600 });
  return events ?? [];
}

export async function getEvent(slug: string): Promise<EventDetail | null> {
  return sanityFetch({ query: EVENT_QUERY, params: { slug, today: lagosToday() }, tags: ["event", `event:${slug}`], revalidate: 3600 });
}

export async function getEventSlugs(): Promise<string[]> {
  return (await sanityFetch({ query: EVENT_SLUGS_QUERY, tags: ["event"] })) ?? [];
}

export async function getTestimonyPage(): Promise<TestimonyPageData | null> {
  return sanityFetch({ query: TESTIMONY_PAGE_QUERY, tags: ["testimonyPage"] });
}
