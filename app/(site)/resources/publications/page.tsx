import type { Metadata } from "next";

import { PublicationLibrary } from "@/components/publications/publication-library";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { getListingPage, getPublications } from "@/lib/content";

export const metadata: Metadata = {
  title: "Publications",
  description: "Books, articles and study guides from New Covenant Church, Ikeja.",
};

export default async function PublicationsPage() {
  const [page, items] = await Promise.all([getListingPage("publicationsPage"), getPublications()]);

  return (
    <>
      <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-ink px-6 pt-20 lg:h-[611px] lg:pt-0">
        <CmsImage image={page?.heroImage} alt="" sizes="100vw" preload />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="relative flex max-w-[900px] flex-col items-center gap-3 py-16 text-center text-white">
          <h1 className="text-[40px] leading-[48px] font-bold tracking-[-0.02em] sm:text-6xl sm:leading-[56px]">
            {page?.heroHeading ?? "Publications"}
          </h1>
          {page?.heroText && <p className="text-lg leading-7 sm:text-[25px]">{page.heroText}</p>}
        </div>
      </section>

      <Container className="pt-12 pb-40 lg:px-16">
        <PublicationLibrary items={items} />
      </Container>
    </>
  );
}
