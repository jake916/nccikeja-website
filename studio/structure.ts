import { BookIcon } from "@sanity/icons/Book";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { InboxIcon } from "@sanity/icons/Inbox";
import { PlayIcon } from "@sanity/icons/Play";
import { StarIcon } from "@sanity/icons/Star";
import { HeartIcon } from "@sanity/icons/Heart";
import { HomeIcon } from "@sanity/icons/Home";
import { UsersIcon } from "@sanity/icons/Users";
import type { ComponentType } from "react";
import type { StructureBuilder, StructureResolver } from "sanity/structure";

/** One listingPage document per listing route, with a fixed id. */
const LISTING_PAGES = [
  ["sermonsPage", "Sermons Page"],
  ["publicationsPage", "Publications Page"],
  ["eventsPage", "Events Page"],
] as const;

/** Created by website forms, grouped under "Form Submissions". */
export const SUBMISSION_TYPES = new Set(["enrolment", "prayerRequest", "connectSubmission", "eventRegistration", "testimony"]);

/** Document types that exist exactly once, with `_id` equal to the type name. */
export const SINGLETON_TYPES = new Set(["siteSettings", "homePage", "givePage", "whoWeArePage", "academyPage", "listingPage", "onlineChurchPage", "testimonyPage"]);

function singleton(S: StructureBuilder, typeName: string, title: string, icon: ComponentType) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "siteSettings", "Site Settings", CogIcon),
      S.divider(),
      singleton(S, "homePage", "Home Page", HomeIcon),
      singleton(S, "whoWeArePage", "Who We Are Page", UsersIcon),
      singleton(S, "academyPage", "Academy Page", BookIcon),
      singleton(S, "onlineChurchPage", "Online Church Page", PlayIcon),
      singleton(S, "testimonyPage", "Testimony Page", StarIcon),
      singleton(S, "givePage", "Give Page", HeartIcon),
      S.listItem()
        .title("Listing Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Listing Pages")
            .items(
              LISTING_PAGES.map(([id, title]) =>
                S.listItem().title(title).id(id).child(S.document().schemaType("listingPage").documentId(id).title(title)),
              ),
            ),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? "") && !SUBMISSION_TYPES.has(item.getId() ?? ""),
      ),
      S.divider(),
      S.listItem()
        .title("Form Submissions")
        .icon(InboxIcon)
        .child(
          S.list()
            .title("Form Submissions")
            .items([...SUBMISSION_TYPES].map((type) => S.documentTypeListItem(type))),
        ),
    ]);
