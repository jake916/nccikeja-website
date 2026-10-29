"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";

const tabs = [
  { id: "naira", label: "Naira Account" },
  { id: "domiciliary", label: "Domiciliary Account" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/** Pill toggle between Naira and Domiciliary accounts. Panels are rendered on the server and passed in. */
export function AccountTabs({ panels }: { panels: Record<TabId, React.ReactNode> }) {
  const [active, setActive] = useState<TabId>("naira");

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label="Account type" className="mx-auto flex gap-1 rounded-full bg-surface-dim p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs leading-5 font-bold tracking-[0.05em] uppercase transition-colors sm:px-6 sm:text-sm",
              active === tab.id ? "bg-brand-red text-white" : "text-muted hover:text-navy",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={`panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className="flex flex-col gap-8"
        >
          {panels[tab.id]}
        </div>
      ))}
    </div>
  );
}
