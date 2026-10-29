import "server-only";

import type { ClientReturn, QueryParams } from "next-sanity";

import { client } from "./client";

/**
 * Fetch from Sanity with Next.js caching.
 * - `tags`: cache tags, so a webhook can call `revalidateTag(tag)` when content changes
 * - `revalidate`: seconds before the cached result is refreshed. Defaults to 60, or to
 *   `false` (cache until revalidated by tag) when tags are given and no value is passed.
 *
 * Returns `null` when Sanity isn't configured, so pages still render without content.
 */
export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate,
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<ClientReturn<QueryString> | null> {
  if (!client) return null;

  return client.fetch(query, params, {
    next: {
      revalidate: revalidate ?? (tags.length ? false : 60),
      tags,
    },
  });
}
