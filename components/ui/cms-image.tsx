import Image from "next/image";

import { urlFor, type SanityImage } from "@/sanity/lib/image";

type CmsImageProps = {
  image: SanityImage | null | undefined;
  /** Used when the Sanity image has no alt text of its own. Pass "" for decorative images. */
  alt: string;
  /** Responsive sizes hint, e.g. "(min-width: 1024px) 50vw, 100vw". Required so the browser never downloads an oversized file. */
  sizes: string;
  className?: string;
  preload?: boolean;
};

/**
 * Fills its (relatively positioned) parent with an image from Sanity, served through
 * next/image as resized AVIF/WebP with a blur-up placeholder. Renders nothing when no
 * image has been uploaded, so the parent's background colour shows instead.
 */
export function CmsImage({ image, alt, sizes, className = "object-cover", preload }: CmsImageProps) {
  if (!image?.asset) return null;

  return (
    <Image
      src={urlFor(image).auto("format").url()}
      alt={image.alt ?? alt}
      fill
      sizes={sizes}
      preload={preload}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip ?? undefined}
      className={className}
      style={image.hotspot ? { objectPosition: `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%` } : undefined}
    />
  );
}
