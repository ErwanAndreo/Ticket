"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SucheContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Suche</h1>
      {q && (
        <p className="text-sm text-[var(--muted-foreground)]">
          Suchbegriff: <strong>{q}</strong>
        </p>
      )}
      <p className="text-[var(--muted-foreground)]">
        Suche über Termine, Anträge, Personen, Inventar, Infos – wird mit Backend verbunden.
      </p>
    </div>
  );
}

export default function SuchePage() {
  return (
    <Suspense fallback={<p className="text-[var(--muted-foreground)]">Lade…</p>}>
      <SucheContent />
    </Suspense>
  );
}
