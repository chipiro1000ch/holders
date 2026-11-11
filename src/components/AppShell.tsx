"use client";

import { Suspense, useEffect, useState } from "react";
import { AppNav } from "./AppNav";
import type { User } from "@/lib/types";

type Props = {
  children: React.ReactNode;
};

function NavFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(244,245,247,0.86)] backdrop-blur-md">
      <div className="feed-shell px-4 py-3 sm:px-0">
        <p className="font-[family-name:var(--font-cinzel)] text-[1.15rem] font-semibold uppercase tracking-[0.28em] text-ink">
          Holders
        </p>
      </div>
    </header>
  );
}

export function AppShell({ children }: Props) {
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const data = (await res.json()) as {
          signedIn: boolean;
          user?: User;
        };
        if (!cancelled && data.signedIn && data.user) {
          setMe(data.user);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Suspense fallback={<NavFallback />}>
        <AppNav me={me} />
      </Suspense>
      <main className="flex-1 pb-16">{children}</main>
      <footer className="border-t border-[var(--line)] py-6 text-center text-xs tracking-[0.2em] text-ink-soft uppercase">
        Holders · Men&apos;s watches &amp; jewelry
      </footer>
    </>
  );
}
