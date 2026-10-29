import type { PublicationKind } from "@/sanity/lib/queries";

export const kindLabels: Record<PublicationKind, string> = {
  book: "Book",
  ebook: "E-Book",
  article: "Article",
  devotional: "Daily Devotional",
  studyGuide: "Study Guide",
  audioSeries: "Audio Series",
};

/** Library filter tabs and the kinds each one includes. */
export const libraryTabs: { label: string; kinds: PublicationKind[] | null }[] = [
  { label: "All", kinds: null },
  { label: "Books", kinds: ["book", "ebook"] },
  { label: "Articles", kinds: ["article", "devotional"] },
  { label: "Study Guides", kinds: ["studyGuide", "audioSeries"] },
];

/** Articles and devotionals open in the reader layout; everything else in the library layout. */
export function isReadable(kind: PublicationKind) {
  return kind === "article" || kind === "devotional";
}

/** 4404019 → "4.2 MB" */
export function formatFileSize(bytes: number) {
  return bytes >= 1_000_000 ? `${(bytes / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
