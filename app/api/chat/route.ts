import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { CHAT_MESSAGES_QUERY, type ChatMessage } from "@/sanity/lib/queries";

// Polled by the Online Church chat every few seconds; always reads fresh, uncached data.
export async function GET() {
  if (!client) return NextResponse.json([]);
  const messages: ChatMessage[] = await client.withConfig({ useCdn: false }).fetch(CHAT_MESSAGES_QUERY, {}, { cache: "no-store" });
  return NextResponse.json(messages.reverse(), { headers: { "Cache-Control": "no-store" } });
}
