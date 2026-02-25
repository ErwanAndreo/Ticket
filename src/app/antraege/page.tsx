"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STORAGE_KEYS, getItem } from "@/lib/storage";

const KATEGORIEN = [
  "Alle",
  "Schaden melden",
  "Urlaub",
  "Material",
  "Sonstiges",
];

const MOCK_ANTRAGE = [
  { id: "1", titel: "Reparatur Küche", kategorie: "Schaden melden", status: "In Bearbeitung", datum: "2025-02-20" },
  { id: "2", titel: "Urlaubsantrag März", kategorie: "Urlaub", status: "Offen", datum: "2025-02-18" },
  { id: "3", titel: "Neue Verbandskästen", kategorie: "Material", status: "Erledigt", datum: "2025-02-10" },
];

export default function AntraegePage() {
  const [search, setSearch] = useState("");
  const [kategorie, setKategorie] = useState("Alle");
  const [stored, setStored] = useState<{ id: string; titel: string; kategorie: string; status: string; datum: string }[]>([]);

  useEffect(() => {
    setStored(getItem<{ id: string; titel: string; kategorie: string; status: string; datum: string }[]>(STORAGE_KEYS.ANTRAGE, []));
  }, []);

  const allAntraege = [...stored, ...MOCK_ANTRAGE];
  const filtered = allAntraege.filter((a) => {
    if (kategorie !== "Alle" && a.kategorie !== kategorie) return false;
    if (search && !a.titel.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Anträge</h1>

      <input
        type="search"
        placeholder="Anträge durchsuchen (Titel, Kategorie, Nr.)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-xl rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--muted-foreground)]">Kategorien:</span>
        {KATEGORIEN.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKategorie(k)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              kategorie === k
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] text-[var(--foreground)]"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <Link
        href="/antraege/schaden-melden"
        className="block rounded-xl border-2 border-red-400 bg-red-50 p-4 text-center text-lg font-bold text-red-800"
      >
        Schaden melden
      </Link>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Laufende Anträge
        </h2>
        <ul className="space-y-2">
          {filtered.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div>
                <span className="font-medium text-[var(--foreground)]">{a.titel}</span>
                <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                  {a.kategorie} · {a.status} · {a.datum}
                </span>
              </div>
              <Link
                href={`/antraege/${a.id}`}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Details
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
