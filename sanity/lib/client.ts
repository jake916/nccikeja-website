import { createClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Use the CDN for published content; set to false if you need fresh data on every request
      useCdn: true,
    })
  : null;
