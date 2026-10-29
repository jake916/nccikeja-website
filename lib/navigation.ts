export type NavLink = { label: string; href: string; description?: string; icon?: { src: string; width: number; height: number } };

export type NavItem = NavLink & { children?: NavLink[] };

export const resourceLinks: NavLink[] = [
  {
    label: "World Changers Academy",
    href: "/resources/academy",
    description: "Equipping for impact",
    icon: { src: "/icons/academy/menu-academy.svg", width: 22, height: 16 },
  },
  {
    label: "Latest Sermons",
    href: "/resources/sermons",
    description: "Watch or listen anytime",
    icon: { src: "/icons/academy/menu-sermons.svg", width: 18, height: 18 },
  },
  {
    label: "Publications",
    href: "/resources/publications",
    description: "Books and articles",
    icon: { src: "/icons/academy/menu-publications.svg", width: 20, height: 20 },
  },
];

export const mainNav: NavItem[] = [
  { label: "Who we are", href: "/who-we-are" },
  { label: "Resources", href: "/resources/academy", children: resourceLinks },
  { label: "Online Church", href: "/online-church" },
  { label: "Events", href: "/events" },
  { label: "Testimony", href: "/testimony" },
];

export const partnerLink: NavLink = { label: "Become a Partner", href: "/give" };

export const footerQuickLinks: NavLink[] = [
  { label: "Who we are", href: "/who-we-are" },
  { label: "World Changers Academy", href: "/resources/academy" },
  { label: "Become a Partner", href: "/give" },
  { label: "Testimonies", href: "/testimony" },
  { label: "Online Church", href: "/online-church" },
  { label: "Events", href: "/events" },
];

export const footerMediaLinks: NavLink[] = [
  { label: "Watch Live", href: "/online-church" },
  { label: "Sermons", href: "/resources/sermons" },
  { label: "Publications", href: "/resources/publications" },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms and Conditions", href: "/terms" },
];

/** True when `pathname` is `href` or a page beneath it. */
export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
