"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";

export function Header() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = getCurrentUser();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-semibold text-[var(--primary)]">
          Ticket V-Beide
        </Link>
        <Link
          href="/auftraege"
          className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
        >
          Laufende Aufträge
        </Link>
      </div>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--primary)] bg-[var(--primary)]/20 text-sm font-medium text-[var(--primary)]"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            (user.displayName || "?")[0].toUpperCase()
          )}
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg">
            <Link
              href="/profil"
              className="block px-4 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--muted)]"
              onClick={() => setOpen(false)}
            >
              Profil
            </Link>
            <Link
              href="/einstellungen"
              className="block px-4 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--muted)]"
              onClick={() => setOpen(false)}
            >
              Einstellungen
            </Link>
            <hr className="my-1 border-[var(--border)]" />
            <Link
              href="/abmelden"
              className="block px-4 py-2 text-left text-sm text-red-600 hover:bg-[var(--muted)]"
              onClick={() => setOpen(false)}
            >
              Abmelden
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
