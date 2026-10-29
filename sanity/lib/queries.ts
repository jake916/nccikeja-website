import { defineQuery, type PortableTextBlock } from "next-sanity";

import type { SanityImage } from "./image";

// Every image field is projected the same way so <CmsImage> gets alt text and a blur placeholder.
const image = /* groq */ `{ asset, hotspot, crop, alt, "lqip": asset->metadata.lqip }`;

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  tagline,
  address,
  email,
  phone,
  serviceTimes[]{ _key, day, services[]{ _key, name, time } },
  socialLinks
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_type == "homePage"][0]{
  heroHeading,
  heroSubheading,
  heroImages[]{ _key, asset, hotspot, crop, alt, "lqip": asset->metadata.lqip },
  welcomeHeading,
  welcomeText,
  vision,
  mission,
  welcomeImage${image},
  welcomeImageCaption,
  welcomeImageSubcaption,
  inPersonImage${image},
  sermonImage${image},
  sermonVideoUrl,
  testimonyImage${image},
  testimonyVideoUrl
}`);

// GROQ slice bounds can't be parameters, so the limit is baked in. `$today` is a YYYY-MM-DD string.
export const UPCOMING_EVENTS_QUERY = defineQuery(`*[_type == "event" && coalesce(endDate, startDate) >= $today] | order(startDate asc)[0...2]{
  _id,
  title,
  "slug": slug.current,
  startDate,
  endDate,
  summary,
  image${image}
}`);

export const GIVE_PAGE_QUERY = defineQuery(`*[_type == "givePage"][0]{
  heroImage${image},
  verse,
  verseReference,
  featuredBank{ name, accounts[]{ _key, label, number } },
  otherAccounts[]{ _key, bank, label, number },
  domiciliaryAccounts[]{ _key, bank, label, number },
  impactImage${image}
}`);

// Result types — replace with `sanity typegen` output once the Studio schema lives in this repo.

export type ServiceTime = { _key: string; day: string; services: { _key: string; name: string; time: string }[] | null };

export type SocialPlatform = "facebook" | "tiktok" | "instagram" | "spotify" | "youtube";

export type SiteSettings = {
  tagline: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  serviceTimes: ServiceTime[] | null;
  socialLinks: Partial<Record<SocialPlatform, string>> | null;
};

export type HomePageData = {
  heroHeading: string | null;
  heroSubheading: string | null;
  heroImages: (SanityImage & { _key: string })[] | null;
  welcomeHeading: string | null;
  welcomeText: string | null;
  vision: string | null;
  mission: string | null;
  welcomeImage: SanityImage | null;
  welcomeImageCaption: string | null;
  welcomeImageSubcaption: string | null;
  inPersonImage: SanityImage | null;
  sermonImage: SanityImage | null;
  sermonVideoUrl: string | null;
  testimonyImage: SanityImage | null;
  testimonyVideoUrl: string | null;
};

export type EventSummary = {
  _id: string;
  title: string;
  slug: string | null;
  startDate: string;
  endDate: string | null;
  summary: string | null;
  image: SanityImage | null;
};

export type BankAccount = { _key: string; bank?: string | null; label: string | null; number: string };

export type GivePageData = {
  heroImage: SanityImage | null;
  verse: string | null;
  verseReference: string | null;
  featuredBank: { name: string; accounts: BankAccount[] | null } | null;
  otherAccounts: BankAccount[] | null;
  domiciliaryAccounts: BankAccount[] | null;
  impactImage: SanityImage | null;
};

export const WHO_WE_ARE_PAGE_QUERY = defineQuery(`*[_type == "whoWeArePage"][0]{
  heroHeading,
  heroText,
  heroImage${image},
  visionHeading,
  visionText,
  mandateHeading,
  mandateText,
  promiseHeading,
  promiseText,
  promiseTag,
  coreValues[]{ _key, title, description, icon },
  methodText,
  methodBackground${image},
  pillars[]{ _key, title, icon },
  academyText,
  academyBackground${image},
  programmesText,
  programmes[]{ _key, title, description, icon },
  featuredProgramme{ title, description, highlights[]{ _key, title, text } }
}`);

export const ACADEMY_COURSES_QUERY = defineQuery(`*[_type == "academyCourse"] | order(level asc){
  _id,
  level,
  title,
  summary,
  description,
  icon
}`);

export type WhoWeArePageData = {
  heroHeading: string | null;
  heroText: string | null;
  heroImage: SanityImage | null;
  visionHeading: string | null;
  visionText: string | null;
  mandateHeading: string | null;
  mandateText: string | null;
  promiseHeading: string | null;
  promiseText: string | null;
  promiseTag: string | null;
  coreValues: { _key: string; title: string; description: string | null; icon: string | null }[] | null;
  methodText: string | null;
  methodBackground: SanityImage | null;
  pillars: { _key: string; title: string; icon: string | null }[] | null;
  academyText: string | null;
  academyBackground: SanityImage | null;
  programmesText: string | null;
  programmes: { _key: string; title: string; description: string | null; icon: string | null }[] | null;
  featuredProgramme: {
    title: string | null;
    description: string | null;
    highlights: { _key: string; title: string; text: string | null }[] | null;
  } | null;
};

export type AcademyCourse = {
  _id: string;
  level: number;
  title: string;
  summary: string | null;
  description: string | null;
  icon: string | null;
};

export const ACADEMY_PAGE_QUERY = defineQuery(`*[_type == "academyPage"][0]{
  heroTag,
  heroHeading,
  heroText,
  heroImage${image},
  ctaText,
  enrolHeading,
  enrolText,
  enrolImage${image},
  formHeading,
  formText,
  successHeading,
  successText,
  nextSteps
}`);

export type AcademyPageData = {
  heroTag: string | null;
  heroHeading: string | null;
  heroText: string | null;
  heroImage: SanityImage | null;
  ctaText: string | null;
  enrolHeading: string | null;
  enrolText: string | null;
  enrolImage: SanityImage | null;
  formHeading: string | null;
  formText: string | null;
  successHeading: string | null;
  successText: string | null;
  nextSteps: string[] | null;
};

export const LISTING_PAGE_QUERY = defineQuery(`*[_id == $id][0]{
  heroHeading,
  heroText,
  heroImage${image},
  ctaHeading,
  ctaText
}`);

export type ListingPageData = {
  heroHeading: string | null;
  heroText: string | null;
  heroImage: SanityImage | null;
  ctaHeading: string | null;
  ctaText: string | null;
};

const sermonCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  series,
  speaker,
  date,
  duration,
  thumbnail${image}
`;

export const SERMONS_QUERY = defineQuery(`*[_type == "sermon" && defined(slug.current)] | order(date desc){${sermonCard}}`);

export const SERMON_QUERY = defineQuery(`*[_type == "sermon" && slug.current == $slug][0]{
  ${sermonCard},
  description,
  videoUrl,
  "audioUrl": audio.asset->url,
  "isLatest": !defined(*[_type == "sermon" && date > ^.date][0]._id)
}`);

export const RECOMMENDED_SERMONS_QUERY = defineQuery(`*[_type == "sermon" && defined(slug.current) && slug.current != $slug] | order(date desc)[0...16]{${sermonCard}}`);

export const SERMON_SLUGS_QUERY = defineQuery(`*[_type == "sermon" && defined(slug.current)].slug.current`);

export type SermonSummary = {
  _id: string;
  title: string;
  slug: string;
  series: string | null;
  speaker: string | null;
  date: string;
  duration: string | null;
  thumbnail: SanityImage | null;
};

export type SermonDetail = SermonSummary & {
  description: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  isLatest: boolean;
};

export type PublicationKind = "book" | "ebook" | "article" | "devotional" | "studyGuide" | "audioSeries";

const publicationCard = /* groq */ `
  _id,
  kind,
  title,
  "slug": slug.current,
  category,
  publishedAt,
  readingTime,
  excerpt,
  featured,
  purchaseUrl,
  sampleUrl,
  "image": coalesce(cardImage, coverImage)${image},
  "pdf": pdf.asset->{ url, size },
  "audioUrl": audio.asset->url
`;

export const PUBLICATIONS_QUERY = defineQuery(`*[_type == "publication" && defined(slug.current)] | order(coalesce(featured, false) desc, publishedAt desc){${publicationCard}}`);

export const PUBLICATION_QUERY = defineQuery(`*[_type == "publication" && slug.current == $slug][0]{
  ${publicationCard},
  subtitle,
  coverImage${image},
  author{ name, photo${image} },
  body,
  keyThemes,
  "epub": epub.asset->{ url, size },
  "related": coalesce(
    related[]->{${publicationCard}},
    *[_type == "publication" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...3]{${publicationCard}}
  )
}`);

export const PUBLICATION_SLUGS_QUERY = defineQuery(`*[_type == "publication" && defined(slug.current)].slug.current`);

export type FileAsset = { url: string; size: number } | null;

export type PublicationSummary = {
  _id: string;
  kind: PublicationKind;
  title: string;
  slug: string;
  category: string | null;
  publishedAt: string;
  readingTime: number | null;
  excerpt: string | null;
  featured: boolean | null;
  purchaseUrl: string | null;
  sampleUrl: string | null;
  image: SanityImage | null;
  pdf: FileAsset;
  audioUrl: string | null;
};

export type PublicationDetail = PublicationSummary & {
  subtitle: string | null;
  coverImage: SanityImage | null;
  author: { name: string | null; photo: SanityImage | null } | null;
  body: PortableTextBlock[] | null;
  keyThemes: string[] | null;
  epub: FileAsset;
  related: PublicationSummary[] | null;
};

export const ONLINE_CHURCH_PAGE_QUERY = defineQuery(`*[_type == "onlineChurchPage"][0]{
  isLive,
  streamUrl,
  streamTitle,
  streamSubtitle,
  poster${image},
  keyScriptures[]{ _key, reference, text },
  prayerHeading,
  prayerText,
  prayerImage${image},
  prayerCategories,
  connectHeading,
  connectText,
  connectImage${image},
  departments
}`);

export const CHAT_MESSAGES_QUERY = defineQuery(`*[_type == "chatMessage" && defined(postedAt)] | order(postedAt desc)[0...50]{
  _id,
  name,
  text,
  moderator,
  postedAt
}`);

export type OnlineChurchPageData = {
  isLive: boolean | null;
  streamUrl: string | null;
  streamTitle: string | null;
  streamSubtitle: string | null;
  poster: SanityImage | null;
  keyScriptures: { _key: string; reference: string; text: string | null }[] | null;
  prayerHeading: string | null;
  prayerText: string | null;
  prayerImage: SanityImage | null;
  prayerCategories: string[] | null;
  connectHeading: string | null;
  connectText: string | null;
  connectImage: SanityImage | null;
  departments: string[] | null;
};

export type ChatMessage = { _id: string; name: string; text: string; moderator: boolean | null; postedAt: string };

const eventCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  category,
  label,
  startDate,
  endDate,
  startTime,
  timeLabel,
  venue,
  summary,
  featured,
  registrationOpen,
  streamUrl,
  image${image}
`;

// All events that haven't finished yet. `$today` is a YYYY-MM-DD string.
export const EVENTS_QUERY = defineQuery(`*[_type == "event" && defined(slug.current) && coalesce(endDate, startDate) >= $today] | order(startDate asc){${eventCard}}`);

export const EVENT_QUERY = defineQuery(`*[_type == "event" && slug.current == $slug][0]{
  ${eventCard},
  address,
  speaker,
  body,
  galleryImage${image},
  registrationNote,
  "related": *[_type == "event" && defined(slug.current) && slug.current != $slug && coalesce(endDate, startDate) >= $today] | order(startDate asc)[0...3]{${eventCard}}
}`);

export const EVENT_SLUGS_QUERY = defineQuery(`*[_type == "event" && defined(slug.current)].slug.current`);

export const TESTIMONY_PAGE_QUERY = defineQuery(`*[_type == "testimonyPage"][0]{
  heroHeading,
  heroText,
  heroImage${image},
  watchUrl,
  formHeading,
  formText,
  expressions,
  categories
}`);

export type EventItem = {
  _id: string;
  title: string;
  slug: string;
  category: "sundayService" | "specialService" | "conference" | "community" | null;
  label: string | null;
  startDate: string;
  endDate: string | null;
  startTime: string | null;
  timeLabel: string | null;
  venue: string | null;
  summary: string | null;
  featured: boolean | null;
  registrationOpen: boolean | null;
  streamUrl: string | null;
  image: SanityImage | null;
};

export type EventDetail = EventItem & {
  address: string | null;
  speaker: string | null;
  body: PortableTextBlock[] | null;
  galleryImage: SanityImage | null;
  registrationNote: string | null;
  related: EventItem[] | null;
};

export type TestimonyPageData = {
  heroHeading: string | null;
  heroText: string | null;
  heroImage: SanityImage | null;
  watchUrl: string | null;
  formHeading: string | null;
  formText: string | null;
  expressions: string[] | null;
  categories: string[] | null;
};
