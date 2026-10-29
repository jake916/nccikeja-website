import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNav, partnerLink } from "@/lib/navigation";

import { HeaderShell } from "./header-shell";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavDropdown } from "./nav-dropdown";
import { HeaderNavLink } from "./nav-link";

const navLinkClass =
  "block w-[120px] p-1 text-center text-sm leading-5 font-medium tracking-[0.01em] text-white/90 transition-colors hover:text-gold";

/** Bar that sits over each page's hero (or a <HeaderBackdrop> on pages without one). */
export function SiteHeader() {
  return (
    <HeaderShell>
      <Container className="flex h-20 items-center justify-between gap-6 lg:px-[72px]">
        <Logo className="h-11 lg:h-12" preload />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-2">
            {mainNav.map((item) => (
              <li key={item.label} className="relative">
                {item.children ? (
                  <NavDropdown item={item} className={navLinkClass} />
                ) : (
                  <HeaderNavLink link={item} className={navLinkClass} />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={partnerLink.href} size="md">
            {partnerLink.label}
          </ButtonLink>
        </div>

        <MobileNav links={mainNav} cta={partnerLink} />
      </Container>
    </HeaderShell>
  );
}
