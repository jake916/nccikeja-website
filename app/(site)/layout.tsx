import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/content";

/** Shared chrome for every public page: overlay header, page content, footer. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader />
      <main className="relative flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
