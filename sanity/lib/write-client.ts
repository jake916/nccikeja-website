import "server-only";

import { client } from "./client";

const token = process.env.SANITY_API_WRITE_TOKEN;

/**
 * Authenticated client for saving website form submissions. Server-only: the token
 * never reaches the browser. `null` when Sanity or the token isn't configured.
 */
export const writeClient = client && token ? client.withConfig({ token, useCdn: false }) : null;
