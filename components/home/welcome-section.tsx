import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/cms-image";
import { Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePageData } from "@/sanity/lib/queries";

type WelcomeContent = Pick<
  HomePageData,
  "welcomeHeading" | "welcomeText" | "vision" | "mission" | "welcomeImage" | "welcomeImageCaption" | "welcomeImageSubcaption"
>;

export function WelcomeSection({ content }: { content: WelcomeContent }) {
  const pillars = [
    {
      title: "Our Vision",
      text: content.vision,
      icon: { src: "/icons/vision.svg", width: 22, height: 15 },
      tint: "bg-gold/10",
    },
    {
      title: "Our Mission",
      text: content.mission,
      icon: { src: "/icons/mission.svg", width: 20.047, height: 20.071 },
      tint: "bg-navy/10",
    },
  ].filter((pillar) => pillar.text);

  return (
    <Section className="bg-surface" containerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col items-start gap-6">
        <SectionHeading title={content.welcomeHeading ?? "Welcome Home"} description={content.welcomeText} />

        {pillars.length > 0 && (
          <ul className="flex flex-col gap-6 pb-2">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex gap-4">
                <span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${pillar.tint}`}>
                  <Image src={pillar.icon.src} alt="" width={pillar.icon.width} height={pillar.icon.height} />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl leading-7 font-semibold text-navy">{pillar.title}</h3>
                  <p className="leading-6 text-muted">{pillar.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <ButtonLink href="/who-we-are" variant="outline-red" size="sm">
          Learn More
          <Image src="/icons/arrow-outlined.svg" alt="" width={12} height={24} />
        </ButtonLink>
      </div>

      <figure className="relative h-[420px] overflow-hidden rounded-xl border border-outline/30 bg-surface-dim shadow-card lg:h-[500px]">
        <CmsImage
          image={content.welcomeImage}
          alt="Worship at New Covenant Church, Ikeja"
          sizes="(min-width: 1024px) 568px, 100vw"
        />
        {(content.welcomeImageCaption || content.welcomeImageSubcaption) && (
          <figcaption className="absolute inset-x-0 bottom-0 border-t border-outline/20 bg-[#fafaf8]/80 p-8 backdrop-blur-[6px]">
            {content.welcomeImageCaption && (
              <p className="text-lg leading-7 font-semibold text-navy">{content.welcomeImageCaption}</p>
            )}
            {content.welcomeImageSubcaption && <p className="leading-6 text-muted">{content.welcomeImageSubcaption}</p>}
          </figcaption>
        )}
      </figure>
    </Section>
  );
}
