"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { STORAGE_KEYS, getItem, setItem } from "@/lib/storage";

interface PinnwandAufgabe {
  id: string;
  titel: string;
  beschreibung: string;
  uebernommenVon: string | null;
  datum: string;
}

const MOCK_NEWS = [
  { id: "n1", typ: "news", titel: "Neue SAN-Schulung im März", datum: "2025-02-20", text: "Anmeldung ab sofort möglich." },
  { id: "n2", typ: "news", titel: "Lagerräume ab nächster Woche geöffnet", datum: "2025-02-18", text: "Zugang wie besprochen." },
];

const DEFAULT_AUFGABEN: PinnwandAufgabe[] = [
  { id: "a1", titel: "Kabeltrommel zurückbringen", beschreibung: "Zur Technik-Station", uebernommenVon: null, datum: "2025-02-21" },
  { id: "a2", titel: "Protokoll der letzten Sitzung tippen", beschreibung: "Vorlage liegt im Büro", uebernommenVon: null, datum: "2025-02-19" },
  { id: "a3", titel: "Erste-Hilfe-Koffer prüfen", beschreibung: "SAN-Raum", uebernommenVon: null, datum: "2025-02-20" },
];

function loadPinnwandAufgaben(): PinnwandAufgabe[] {
  const stored = getItem<PinnwandAufgabe[]>(STORAGE_KEYS.PINNWAND_AUFGABEN, []);
  if (stored.length > 0) return stored;
  return DEFAULT_AUFGABEN;
}

export default function PinnwandPage() {
  const user = getCurrentUser();
  const [aufgaben, setAufgaben] = useState<PinnwandAufgabe[]>([]);

  useEffect(() => {
    setAufgaben(loadPinnwandAufgaben());
  }, []);

  const saveAufgaben = (next: PinnwandAufgabe[]) => {
    setAufgaben(next);
    setItem(STORAGE_KEYS.PINNWAND_AUFGABEN, next);
  };

  const aufgabeSchnappen = (id: string) => {
    saveAufgaben(
      aufgaben.map((a) =>
        a.id === id ? { ...a, uebernommenVon: user.displayName } : a
      )
    );
  };

  const aufgabeAbgeben = (id: string) => {
    saveAufgaben(
      aufgaben.map((a) => (a.id === id ? { ...a, uebernommenVon: null } : a))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Pinnwand</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        News und Aufgaben, die erledigt werden müssen. Aufgaben können übernommen werden – alle sehen, wer sie hat.
      </p>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">News</h2>
        <ul className="space-y-2">
          {MOCK_NEWS.map((n) => (
            <li
              key={n.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <span className="font-medium text-[var(--foreground)]">{n.titel}</span>
              <span className="ml-2 text-sm text-[var(--muted-foreground)]">{n.datum}</span>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{n.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Aufgaben (schnappen & erledigen)
        </h2>
        <ul className="space-y-2">
          {aufgaben.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-medium text-[var(--foreground)]">{a.titel}</span>
                  <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">{a.beschreibung}</p>
                  {a.uebernommenVon ? (
                    <p className="mt-1 text-sm font-medium text-green-700">
                      {a.uebernommenVon} hat die Aufgabe übernommen
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">Noch niemand</p>
                  )}
                </div>
                <div className="shrink-0">
                  {a.uebernommenVon === user.displayName ? (
                    <button
                      type="button"
                      onClick={() => aufgabeAbgeben(a.id)}
                      className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm hover:opacity-90"
                    >
                      Abgeben
                    </button>
                  ) : !a.uebernommenVon ? (
                    <button
                      type="button"
                      onClick={() => aufgabeSchnappen(a.id)}
                      className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm text-[var(--primary-foreground)] font-medium"
                    >
                      Übernehmen
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
