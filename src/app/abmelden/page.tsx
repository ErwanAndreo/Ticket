"use client";

import Link from "next/link";

export default function AbmeldenPage() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Abmelden</h1>
      <p className="text-[var(--muted-foreground)]">
        Platzhalter: Hier wird später die Abmeldung (z. B. AD-Logout) ausgeführt.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[var(--primary-foreground)] font-medium hover:opacity-90"
      >
        Zurück zum Dashboard
      </Link>
    </div>
  );
}
