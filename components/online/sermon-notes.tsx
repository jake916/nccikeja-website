"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const KEY = "nc-sermon-notes";

/** Notes are kept in this browser only (the site has no user accounts), saved as you type. */
export function SermonNotes() {
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring from browser storage after hydration
      setNotes(localStorage.getItem(KEY) ?? "");
    } catch {
      // Storage unavailable (private mode): notes just won't persist
    }
  }, []);

  function save(value: string) {
    try {
      localStorage.setItem(KEY, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <section className="flex flex-col rounded-xl border border-outline/30 bg-surface-bright p-6 shadow-[0_1px_2px_rgb(0_0_0/0.05)]">
      <h2 className="flex items-center gap-3 pb-4 text-2xl leading-8 font-semibold text-ink">
        <Image src="/icons/online/notes.svg" alt="" width={18} height={16} />
        Sermon Notes
      </h2>
      <label className="flex-1">
        <span className="sr-only">Your notes</span>
        <textarea
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            save(e.target.value);
          }}
          placeholder="Jot down your thoughts here... these save automatically on this device."
          className="h-[171px] w-full resize-none bg-transparent leading-6 text-body placeholder:text-outline focus:outline-none"
        />
      </label>
      <div className="mt-4 flex justify-end border-t border-outline/20 pt-4">
        <button type="button" onClick={() => save(notes)} className="flex items-center gap-1 leading-4 font-semibold tracking-[0.02em] text-brand-red">
          {saved ? "Saved" : "Save Notes"}
          <Image src="/icons/online/save.svg" alt="" width={13.5} height={13.5} />
        </button>
      </div>
    </section>
  );
}
