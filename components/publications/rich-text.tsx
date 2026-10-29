import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "next-sanity";

/** Article typography from the design's reader screen. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-lg leading-7 text-body">{children}</p>,
    lead: ({ children }) => <p className="text-xl leading-7 font-medium text-ink">{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl leading-8 font-semibold text-ink">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl leading-7 font-semibold text-ink">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col gap-4 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="flex list-decimal flex-col gap-4 pl-6">{children}</ol>,
  },
  listItem: ({ children }) => <li className="text-lg leading-7 font-bold text-body">{children}</li>,
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="font-medium text-brand-red underline">
        {children}
      </a>
    ),
  },
  types: {
    scripture: ({ value }: { value: { text?: string; reference?: string } }) => (
      <figure className="flex flex-col gap-4 rounded-xl border border-outline bg-surface-container p-8 sm:p-12">
        <blockquote className="text-2xl leading-8 font-semibold text-navy">&ldquo;{value.text}&rdquo;</blockquote>
        {value.reference && (
          <figcaption className="text-right text-sm leading-5 font-medium tracking-[0.01em] text-muted">— {value.reference}</figcaption>
        )}
      </figure>
    ),
  },
};

export function RichText({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
