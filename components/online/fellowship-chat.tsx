"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { postChatMessage } from "@/app/(site)/online-church/actions";
import { cn } from "@/lib/cn";
import type { ChatMessage } from "@/sanity/lib/queries";

const NAME_KEY = "nc-chat-name";
const POLL_MS = 5000;
const avatarColours = ["bg-[#e0e0ff] text-navy", "bg-[#ffdad4] text-[#410000]", "bg-butter text-on-butter", "bg-[#d1fae5] text-[#065f46]"];

const time = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Lagos", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

/** Live-ish chat backed by Sanity: polls for new messages and posts through a server action. */
export function FellowshipChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/chat", { cache: "no-store" });
      if (res.ok) setMessages(await res.json());
    } catch {
      // Network hiccup: try again on the next poll
    }
  }, []);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring from browser storage after hydration
      setName(localStorage.getItem(NAME_KEY) ?? "");
    } catch {}
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Please add your name first.");
    if (!text.trim()) return;
    startTransition(async () => {
      const result = await postChatMessage(name, text);
      if (result.status === "success") {
        try {
          localStorage.setItem(NAME_KEY, name.trim());
        } catch {}
        setText("");
        setError(null);
        load();
      } else {
        setError(result.message ?? "Message not sent. Please try again.");
      }
    });
  }

  return (
    <section className="flex h-[620px] flex-col overflow-hidden rounded-xl border border-outline/30 bg-surface-bright shadow-[0_1px_2px_rgb(0_0_0/0.05)] lg:h-full">
      <header className="flex items-center justify-between bg-ink p-4">
        <h2 className="flex items-center gap-2 text-2xl leading-8 font-semibold text-white">
          <Image src="/icons/online/chat.svg" alt="" width={20} height={20} />
          Fellowship Chat
        </h2>
      </header>

      <div ref={listRef} className="flex flex-1 flex-col gap-4 overflow-y-auto bg-white p-4" aria-live="polite">
        {messages.length === 0 && <p className="m-auto text-sm text-subtle">Be the first to say hello!</p>}
        {messages.map((m, i) => (
          <article key={m._id} className="flex gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm leading-5 font-bold",
                m.moderator ? "bg-gold text-[#4f3e00]" : avatarColours[(m.name.charCodeAt(0) + i) % avatarColours.length],
              )}
            >
              {m.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="flex items-baseline gap-2">
                <span className="text-sm leading-5 font-bold tracking-[0.01em] text-ink">{m.name}</span>
                {m.moderator && <span className="rounded bg-ink/10 px-1 text-[10px] leading-[15px] font-bold text-ink uppercase">Mod</span>}
                <time dateTime={m.postedAt} className="text-xs leading-4 text-subtle">
                  {time(m.postedAt)}
                </time>
              </p>
              <p
                className={cn(
                  "self-start rounded-tr-lg rounded-b-lg px-2 py-2 leading-6 break-words text-body",
                  m.moderator ? "border border-gold bg-gold/10" : "bg-surface-container",
                )}
              >
                {m.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-outline/30 bg-surface p-3">
        <Link
          href="/online-church/prayer"
          className="flex items-center justify-center gap-2 rounded-md border border-brand-red/30 bg-brand-red/10 py-2 leading-4 font-semibold tracking-[0.02em] text-brand-red hover:bg-brand-red/15"
        >
          <Image src="/icons/online/prayer.svg" alt="" width={17.5} height={17.083} />
          Submit Prayer Request
        </Link>
      </div>

      <form onSubmit={send} className="flex flex-col gap-2 bg-surface-bright p-4">
        {!name && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            aria-label="Your name"
            className="h-10 rounded-full border border-outline/50 bg-surface-container px-4 text-sm focus:outline-2 focus:outline-navy"
          />
        )}
        <div className="flex items-center gap-2 rounded-full border border-outline/50 bg-surface-container py-2 pr-4 pl-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Say hello to the family..."
            maxLength={500}
            aria-label="Message"
            className="h-10 min-w-0 flex-1 bg-transparent px-3 leading-5 text-body placeholder:text-outline focus:outline-none"
          />
          <button type="submit" disabled={pending} aria-label="Send" className="shrink-0 disabled:opacity-50">
            <Image src="/icons/online/send.svg" alt="" width={27} height={30} />
          </button>
        </div>
        {error && <p className="px-2 text-xs text-brand-red">{error}</p>}
      </form>
    </section>
  );
}
