import Image from "next/image";

import type { BankAccount } from "@/sanity/lib/queries";

import { CopyButton } from "./copy-button";
import { Flag } from "./flag";

/** Highlighted bank (Fidelity in the design) with its accounts in a 2-column grid. */
export function FeaturedBankCard({ name, accounts }: { name: string; accounts: BankAccount[] }) {
  return (
    <section
      aria-labelledby="featured-bank"
      className="flex flex-col gap-6 rounded-lg border border-brand-red/10 bg-blush p-4 drop-shadow-[0_1px_1px_rgb(0_0_0/0.05)] sm:p-6"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-xs bg-ink text-[10px] font-bold text-white" aria-hidden>
            {name.charAt(0)}
          </span>
          <h2 id="featured-bank" className="leading-6 font-bold text-ink">
            {name}
          </h2>
        </div>
        <Flag code="ng" />
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {accounts.map((account) => (
          <li
            key={account._key}
            className="flex items-center justify-between rounded border border-outline/30 bg-white p-4"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] leading-6 font-bold text-subtle uppercase">{account.label}</span>
              <span className="text-xl leading-7 font-bold text-ink tabular-nums">{account.number}</span>
            </div>
            <CopyButton value={account.number} label={[name, account.label].filter(Boolean).join(" ")} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Bordered list card of accounts across several banks. */
export function AccountListCard({
  title,
  accounts,
  emptyMessage,
}: {
  title: string;
  accounts: BankAccount[];
  emptyMessage?: React.ReactNode;
}) {
  const headingId = `${title.toLowerCase().replace(/\W+/g, "-")}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-lg border border-outline/30 bg-white shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]"
    >
      <header className="flex items-center justify-between border-b border-outline/20 bg-surface px-4 pt-4 pb-[17px]">
        <div className="flex items-center gap-2">
          <Image src="/icons/bank.svg" alt="" width={20} height={20} />
          <h2 id={headingId} className="leading-6 font-bold text-ink">
            {title}
          </h2>
        </div>
        <Flag code="ng" size="sm" />
      </header>

      {accounts.length > 0 ? (
        <ul className="flex flex-col gap-4 p-4">
          {accounts.map((account) => {
            const name = [account.bank, account.label].filter(Boolean).join(" | ");
            return (
              <li key={account._key} className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] leading-6 text-subtle">{name}</span>
                  <span className="text-lg leading-7 font-bold text-ink tabular-nums">{account.number}</span>
                </div>
                <CopyButton value={account.number} label={name} />
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="p-6 text-sm leading-6 text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}
