"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@/lib/types";

type Props = {
  me: User | null;
};

export function AppNav({ me }: Props) {
  const pathname = usePathname();
  const onNew = pathname === "/new";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(244,245,247,0.86)] backdrop-blur-md">
      <div className="feed-shell flex items-center justify-between px-4 py-3 sm:px-0">
        <Link href="/" className="group">
          <p className="animate-brand font-[family-name:var(--font-cinzel)] text-[1.15rem] font-semibold uppercase tracking-[0.28em] text-ink">
            Holders
          </p>
          <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.22em] text-ink-soft opacity-80 transition group-hover:opacity-100">
            Watches &amp; Jewelry
          </p>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/new"
            className={`tracking-wide ${onNew ? "text-metal-deep" : "text-ink-soft hover:text-ink"}`}
          >
            投稿
          </Link>
          {me ? (
            <Link
              href={`/u/${me.username}`}
              className="flex items-center gap-2 text-ink-soft hover:text-ink"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={me.avatarUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-1 ring-[var(--line)]"
              />
              <span className="hidden sm:inline">{me.displayName}</span>
            </Link>
          ) : (
            <span className="text-xs text-ink-soft">サインイン待ち</span>
          )}
        </nav>
      </div>
    </header>
  );
}
