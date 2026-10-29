import type { Metadata } from "next";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Section } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading, SectionTitle } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { getAcademyCourses, getWhoWeArePage } from "@/lib/content";
import { pillarIcons, programmeIcons, valueIcons, type IconAsset } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Who we are",
  description: "A family of believers raising world changers by living like Jesus.",
};

export default async function WhoWeArePage() {
  const [page, courses] = await Promise.all([getWhoWeArePage(), getAcademyCourses()]);
  if (!page) return null;

  return (
    <>
      <PageHero
        variant="feature"
        title={page.heroHeading ?? "Who we are"}
        description={page.heroText}
        image={page.heroImage}
      >
        <a
          href="#vision"
          aria-label="Scroll to our vision"
          className="mt-6 flex size-12 items-center justify-center rounded-full border border-surface-bright/30 bg-surface-bright/10 backdrop-blur-[2px] transition-colors hover:bg-surface-bright/20"
        >
          <Image src="/icons/who/arrow-down.svg" alt="" width={16} height={16} />
        </a>
      </PageHero>

      {/* Vision & mandate */}
      <Section id="vision" spacing="lg" className="bg-surface-bright" containerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start gap-4">
            <Tag>Our Vision</Tag>
            {page.visionHeading && <SectionTitle size="lg" className="pt-2">{page.visionHeading}</SectionTitle>}
            {page.visionText && <p className="text-lg leading-7 text-muted">{page.visionText}</p>}
          </div>
          <hr className="border-outline/30" />
          <div className="flex flex-col items-start gap-4">
            <Tag>Our Mandate</Tag>
            {page.mandateHeading && <h3 className="pt-2 text-2xl leading-8 font-semibold text-navy">{page.mandateHeading}</h3>}
            {page.mandateText && <p className="text-lg leading-7 text-muted">{page.mandateText}</p>}
          </div>
        </div>

        {page.promiseHeading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-outline/20 bg-surface-bright p-10 text-center drop-shadow-[0_8px_10px_rgb(21_26_75/0.08)]">
            <span className="mb-6 flex size-16 items-center justify-center rounded-full bg-navy">
              <Image src="/icons/who/with-us.svg" alt="" width={25} height={25} />
            </span>
            <h3 className="mb-4 text-2xl leading-8 font-semibold text-navy">{page.promiseHeading}</h3>
            {page.promiseText && <p className="mb-8 leading-6 text-muted">{page.promiseText}</p>}
            {page.promiseTag && (
              <span className="rounded-full border border-outline/30 bg-surface-container px-6 py-3 text-base leading-7 text-navy sm:text-xl">
                {page.promiseTag}
              </span>
            )}
          </div>
        )}
      </Section>

      {/* Core values */}
      {page.coreValues && page.coreValues.length > 0 && (
        <Section className="border-y border-outline/20 bg-surface" containerClassName="flex flex-col items-center gap-16">
          <SectionHeading
            size="lg"
            align="center"
            title="Our Core Values"
            description="The principles that guide our behavior, decisions, and interactions as a family of believers."
          />
          <ul className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {page.coreValues.map((value) => (
              <li
                key={value._key}
                className="flex flex-col gap-4 rounded-xl border border-white/30 bg-surface-bright p-8 drop-shadow-[0_8px_10px_rgb(21_26_75/0.08)] lg:min-h-[300px]"
              >
                <IconBox icon={value.icon ? valueIcons[value.icon] : undefined} />
                <h3 className="pt-2 text-2xl leading-8 font-semibold text-navy">{value.title}</h3>
                {value.description && <p className="text-sm leading-[22.75px] text-muted">{value.description}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Our method: twelve teaching pillars */}
      {page.pillars && page.pillars.length > 0 && (
        <section className="relative overflow-hidden bg-surface-bright py-16 lg:py-24">
          <CmsImage image={page.methodBackground} alt="" sizes="100vw" className="object-cover opacity-15" />
          <Section spacing="none" className="relative" containerClassName="flex flex-col items-center gap-16">
            <SectionHeading size="lg" align="center" title="Our Method" description={page.methodText} />
            <ul className="grid w-full grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
              {page.pillars.map((pillar) => {
                const icon = pillar.icon ? pillarIcons[pillar.icon] : undefined;
                return (
                  <li
                    key={pillar._key}
                    className="flex min-h-[130px] flex-col gap-3 rounded-xl border border-outline/30 bg-white p-6"
                  >
                    <span className="flex h-[26px] items-center">
                      {icon && <Image src={icon.src} alt="" width={icon.width} height={icon.height} />}
                    </span>
                    <h3 className="leading-6 font-bold text-navy">{pillar.title}</h3>
                  </li>
                );
              })}
            </ul>
          </Section>
        </section>
      )}

      {/* World Changers Academy levels */}
      {courses.length > 0 && (
        <section className="relative overflow-hidden bg-navy py-16 lg:py-24">
          <CmsImage image={page.academyBackground} alt="" sizes="100vw" className="object-cover opacity-15" />
          <Section spacing="none" className="relative" containerClassName="flex flex-col items-center gap-12">
            <div className="flex max-w-[768px] flex-col items-center gap-6 text-center">
              <SectionTitle size="lg" className="text-white">
                World Changers Academy
              </SectionTitle>
              {page.academyText && <p className="text-lg leading-7 text-white/80">{page.academyText}</p>}
            </div>
            <ul className="grid w-full gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-5">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="flex flex-col gap-2 rounded-xl border border-surface-bright/20 bg-surface-bright/10 p-6 backdrop-blur-[2px] lg:min-h-[200px]"
                >
                  <h3 className="text-xl leading-7 text-butter">{course.level} Level</h3>
                  <p className="text-sm leading-5 text-white/80">{course.summary ?? course.title}</p>
                </li>
              ))}
            </ul>
            <ButtonLink href="/resources/academy/enroll" shape="square">
              Enroll Now
            </ButtonLink>
          </Section>
        </section>
      )}

      {/* Flagship programmes */}
      {page.programmes && page.programmes.length > 0 && (
        <Section className="bg-surface" containerClassName="flex flex-col gap-16">
          <SectionHeading size="lg" align="center" title="Flagship Programmes" description={page.programmesText} />
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {page.programmes.map((programme) => {
              const icon = programme.icon ? programmeIcons[programme.icon] : undefined;
              return (
                <li
                  key={programme._key}
                  className="overflow-hidden rounded-xl border border-outline/30 bg-surface-bright shadow-[0_8px_20px_0_rgb(21_26_75/0.08)]"
                >
                  <div className="relative flex h-48 items-center justify-center bg-navy/5 p-6">
                    {icon && (
                      <Image
                        src={icon.src}
                        alt=""
                        width={icon.width}
                        height={icon.height}
                        className="absolute top-6 right-6"
                      />
                    )}
                    <h3 className="relative max-w-[220px] text-center text-xl leading-7 text-navy">{programme.title}</h3>
                  </div>
                  {programme.description && <p className="p-6 text-sm leading-5 text-muted">{programme.description}</p>}
                </li>
              );
            })}

            {page.featuredProgramme?.title && (
              <li className="overflow-hidden rounded-xl border border-outline/30 bg-surface-bright shadow-[0_8px_20px_0_rgb(21_26_75/0.08)] md:col-span-2">
                <div className="relative flex min-h-48 flex-col justify-center bg-navy p-8">
                  <div className="absolute inset-y-0 right-0 left-1/2 bg-linear-to-l from-brand-red/40 to-brand-red/0" />
                  <h3 className="relative pb-2 text-2xl leading-8 text-butter">{page.featuredProgramme.title}</h3>
                  {page.featuredProgramme.description && (
                    <p className="relative max-w-[448px] text-sm leading-5 text-white/80">
                      {page.featuredProgramme.description}
                    </p>
                  )}
                </div>
                {page.featuredProgramme.highlights && (
                  <ul className="grid gap-4 p-6 sm:grid-cols-3">
                    {page.featuredProgramme.highlights.map((highlight) => (
                      <li key={highlight._key} className="flex flex-col gap-1">
                        <h4 className="text-sm leading-5 font-bold text-navy">{highlight.title}</h4>
                        {highlight.text && <p className="text-xs leading-4 text-muted">{highlight.text}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )}
          </ul>
        </Section>
      )}
    </>
  );
}

function IconBox({ icon }: { icon?: IconAsset }) {
  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded bg-butter">
      {icon && <Image src={icon.src} alt="" width={icon.width} height={icon.height} />}
    </span>
  );
}
