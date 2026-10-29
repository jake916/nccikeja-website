import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { footerMediaLinks, footerQuickLinks, legalLinks, type NavLink } from "@/lib/navigation";
import type { SiteSettings, SocialPlatform } from "@/sanity/lib/queries";

import { Logo } from "./logo";

const socials: { platform: SocialPlatform; label: string }[] = [
  { platform: "facebook", label: "Facebook" },
  { platform: "tiktok", label: "TikTok" },
  { platform: "instagram", label: "Instagram" },
  { platform: "spotify", label: "Spotify" },
  { platform: "youtube", label: "YouTube" },
];

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  const year = new Date().getFullYear();
  const { tagline, address, email, phone, serviceTimes, socialLinks } = settings ?? {};

  return (
    <footer className="relative overflow-hidden border-t border-[#cfcfcf]/50 bg-navy py-16 text-white">
      <Image
        src="/icons/footer-graphic.svg"
        alt=""
        width={426.66}
        height={622}
        className="pointer-events-none absolute top-0 right-0 hidden opacity-10 lg:block"
      />

      <Container className="relative flex flex-col gap-12 lg:gap-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[286px_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <Logo className="h-[88px]" />
            {tagline && <p className="leading-6 opacity-90">{tagline}</p>}
          </div>

          <div className="grid gap-10 sm:col-span-2 sm:grid-cols-2 lg:col-span-1 lg:grid-cols-[191px_145px_264px_145px] lg:gap-10">
            <FooterLinks title="Quick Links" links={footerQuickLinks} />

            <div className="flex flex-col gap-3">
              <FooterHeading>Service Times</FooterHeading>
              <dl className="flex flex-col gap-2 text-sm leading-5 font-medium tracking-[0.01em]">
                {serviceTimes?.map((group) => (
                  <div key={group._key}>
                    <dt className="font-bold text-gold">{group.day}:</dt>
                    {group.services?.map((service) => (
                      <dd key={service._key} className="mb-2 opacity-90 last:mb-0">
                        {service.name}{"\u00a0-\u00a0"}<span className="text-gold">{service.time}</span>
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex flex-col gap-3">
              <FooterHeading>Say Hello</FooterHeading>
              <address className="flex flex-col gap-2 text-sm leading-5 font-medium tracking-[0.01em] not-italic">
                {address && (
                  <ContactRow icon="/icons/pin.svg" iconWidth={16} iconHeight={20}>
                    {address}
                  </ContactRow>
                )}
                {email && (
                  <ContactRow icon="/icons/mail.svg" iconWidth={20} iconHeight={16}>
                    <a href={`mailto:${email}`} className="hover:text-gold">
                      {email}
                    </a>
                  </ContactRow>
                )}
                {phone && (
                  <ContactRow icon="/icons/phone.svg" iconWidth={18} iconHeight={18}>
                    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold">
                      {phone}
                    </a>
                  </ContactRow>
                )}
              </address>
            </div>

            <FooterLinks title="Media" links={footerMediaLinks} />
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 text-sm leading-5 font-bold tracking-[0.01em] sm:flex-row sm:items-center sm:gap-8">
            <p>© {year} New Covenant Church, Ikeja. All rights reserved.</p>
            <ul className="flex gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex gap-4">
            {socials.map(({ platform, label }) => {
              const href = socialLinks?.[platform];
              const icon = <Image src={`/icons/social/${platform}.svg`} alt="" width={20} height={20} />;
              const circle = "flex size-10 items-center justify-center rounded-full border border-gold";
              return (
                <li key={platform}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={`${circle} transition-colors hover:bg-white/10`}>
                      {icon}
                    </a>
                  ) : (
                    <span aria-label={label} className={circle}>
                      {icon}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg leading-7">{children}</h2>;
}

function FooterLinks({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <FooterHeading>{title}</FooterHeading>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="inline-block py-2.5 text-sm leading-5 font-medium tracking-[0.01em] opacity-80 transition hover:text-gold hover:opacity-100"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({
  icon,
  iconWidth,
  iconHeight,
  children,
}: {
  icon: string;
  iconWidth: number;
  iconHeight: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-5 shrink-0 items-center justify-center">
        <Image src={icon} alt="" width={iconWidth} height={iconHeight} className="max-h-4 w-auto" />
      </span>
      <span>{children}</span>
    </div>
  );
}
