import type { Metadata } from "next";
import Image from "next/image";

import { AccountTabs } from "@/components/give/account-tabs";
import { AccountListCard, FeaturedBankCard } from "@/components/give/bank-accounts";
import { CmsImage } from "@/components/ui/cms-image";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getGivePage, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Give",
  description: "Partner with New Covenant Church, Ikeja through your tithes, offerings and seeds.",
};

const impactAreas = [
  {
    icon: { src: "/icons/outreach.svg", width: 21, height: 20.5 },
    title: "Community Outreach",
    text: "Providing essential support, food, and medical aid to vulnerable communities in our city.",
  },
  {
    icon: { src: "/icons/academy.svg", width: 22, height: 18 },
    title: "World Changers Academy",
    text: "Empowering the next generation through education, leadership training, and scholarships.",
  },
  {
    icon: { src: "/icons/missions.svg", width: 20, height: 20 },
    title: "Global Missions",
    text: "Supporting missionaries and church plants to spread the gospel across borders.",
  },
];

export default async function GivePage() {
  const [page, settings] = await Promise.all([getGivePage(), getSiteSettings()]);
  const email = settings?.email;

  return (
    <>
      <PageHero title="Giving to the Vision" image={page?.heroImage}>
        {page?.verse && (
          <blockquote className="text-lg leading-7 text-white/90 sm:text-[25px]">
            <p>&ldquo;{page.verse}&rdquo;</p>
            {page.verseReference && <footer className="mt-2">- {page.verseReference}</footer>}
          </blockquote>
        )}
      </PageHero>

      <Container className="relative -mt-4 pb-20">
        <div className="mx-auto max-w-[896px]">
          <AccountTabs
            panels={{
              naira: (
                <>
                  {page?.featuredBank && (
                    <FeaturedBankCard name={page.featuredBank.name} accounts={page.featuredBank.accounts ?? []} />
                  )}
                  <AccountListCard title="Other Accounts" accounts={page?.otherAccounts ?? []} />
                </>
              ),
              domiciliary: (
                <AccountListCard
                  title="Domiciliary Accounts"
                  accounts={page?.domiciliaryAccounts ?? []}
                  emptyMessage={
                    email ? (
                      <>
                        For domiciliary account details, please email{" "}
                        <a href={`mailto:${email}`} className="font-medium text-brand-red underline">
                          {email}
                        </a>
                        .
                      </>
                    ) : (
                      "Domiciliary account details are coming soon."
                    )
                  }
                />
              ),
            }}
          />
        </div>
      </Container>

      <section className="border-y border-outline/10 bg-surface py-16 lg:py-20">
        <Container className="flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-[136px]">
          <div className="flex max-w-[448px] flex-col gap-6">
            <SectionHeading
              title="Your generosity transforms lives"
              description="Every seed sown goes directly towards expanding the kingdom and impacting our community. Your giving fuels our mission to build world changers."
            />
            <ul className="flex flex-col gap-4 pt-2">
              {impactAreas.map((area) => (
                <li key={area.title} className="flex gap-3">
                  <span className="flex w-[22px] shrink-0 justify-center pt-1">
                    <Image src={area.icon.src} alt="" width={area.icon.width} height={area.icon.height} />
                  </span>
                  <div>
                    <h3 className="text-lg leading-7 font-semibold text-navy">{area.title}</h3>
                    <p className="text-sm leading-5 text-muted">{area.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[448/500] w-full max-w-[448px] overflow-hidden rounded-xl bg-surface-dim shadow-[0_8px_20px_0_rgb(21_26_75/0.08)]">
            <CmsImage
              image={page?.impactImage}
              alt="Church volunteers packing donation boxes at a community outreach"
              sizes="(min-width: 640px) 448px, 100vw"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
