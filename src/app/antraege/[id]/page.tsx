"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { STORAGE_KEYS, getItem } from "@/lib/storage";

const MOCK: Record<string, { titel: string; kategorie: string; status: string; datum: string; beschreibung: string }> = {
  "1": {
    titel: "Reparatur Küche",
    kategorie: "Schaden melden",
    status: "In Bearbeitung",
    datum: "2025-02-20",
    beschreibung: "Wasserleitung undicht unter der Spüle.",
  },
  "2": {
    titel: "Urlaubsantrag März",
    kategorie: "Urlaub",
    status: "Offen",
    datum: "2025-02-18",
    beschreibung: "Urlaub 10.–20. März.",
  },
  "3": {
    titel: "Neue Verbandskästen",
    kategorie: "Material",
    status: "Erledigt",
    datum: "2025-02-10",
    beschreibung: "Bestellung erledigt.",
  },
};

export default function AntragDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [a, setA] = useState<{ titel: string; kategorie: string; status: string; datum: string; beschreibung: string } | null>(null);

  useEffect(() => {
    if (MOCK[id]) {
      setA(MOCK[id]);
      return;
    }
    const stored = getItem<{ id: string; titel: string; kategorie: string; status: string; datum: string; beschreibung?: string }[]>(STORAGE_KEYS.ANTRAGE, []);
    const found = stored.find((e) => e.id === id);
    if (found) {
      setA({
        titel: found.titel,
        kategorie: found.kategorie,
        status: found.status,
        datum: found.datum,
        beschreibung: found.beschreibung ?? "—",
      });
    } else {
      setA(null);
    }
  }, [id]);

  if (a === undefined) return <p className="text-[var(--muted-foreground)]">Lade…</p>;
  if (a === null) notFound();

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/antraege" className="text-sm text-[var(--primary)] hover:underline">
        ← Zurück zu Anträge
      </Link>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">{a.titel}</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        {a.kategorie} · {a.status} · {a.datum}
      </p>
      <p className="text-[var(--foreground)]">{a.beschreibung}</p>
    </div>
  );
}
