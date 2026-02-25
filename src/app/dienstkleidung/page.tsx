"use client";

import { useState, useEffect } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/lib/storage";

interface KleidungsEintrag {
  id: string;
  artikel: string;
  groesse: string;
  status: string;
  datum: string;
}

const MOCK_KLEIDUNG: KleidungsEintrag[] = [
  { id: "1", artikel: "T-Shirt blau", groesse: "M", status: "Ausgegeben", datum: "2024-06-01" },
  { id: "2", artikel: "Hose dunkelblau", groesse: "32", status: "Ausgegeben", datum: "2024-06-01" },
  { id: "3", artikel: "Jacke", groesse: "M", status: "Anfrage gestellt", datum: "2025-02-15" },
];

function loadKleidung(): KleidungsEintrag[] {
  const stored = getItem<KleidungsEintrag[]>(STORAGE_KEYS.DIENSTKLEIDUNG, []);
  if (stored.length > 0) return stored;
  return MOCK_KLEIDUNG;
}

export default function DienstkleidungPage() {
  const [liste, setListe] = useState<KleidungsEintrag[]>([]);
  const [showAnfrage, setShowAnfrage] = useState(false);
  const [form, setForm] = useState({ artikel: "T-Shirt", groesse: "" });

  useEffect(() => {
    setListe(loadKleidung());
  }, []);

  const saveListe = (next: KleidungsEintrag[]) => {
    setListe(next);
    setItem(STORAGE_KEYS.DIENSTKLEIDUNG, next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artikelLabel = form.artikel === "T-Shirt" ? "T-Shirt blau" : form.artikel === "Hose" ? "Hose dunkelblau" : form.artikel;
    const newEntry: KleidungsEintrag = {
      id: String(Date.now()),
      artikel: artikelLabel,
      groesse: form.groesse.trim() || "—",
      status: "Anfrage gestellt",
      datum: new Date().toISOString().slice(0, 10),
    };
    saveListe([newEntry, ...liste]);
    setForm({ artikel: "T-Shirt", groesse: "" });
    setShowAnfrage(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dienstkleidung</h1>
        <button
          type="button"
          onClick={() => setShowAnfrage(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-xl text-[var(--primary-foreground)] hover:opacity-90"
          title="Neue Anfrage"
          aria-label="Neue Anfrage"
        >
          +
        </button>
      </div>
      <p className="text-sm text-[var(--muted-foreground)]">
        Deine aktuellen Dienstkleidungen. Neue Anfrage über das Plus oben rechts.
      </p>

      <ul className="space-y-2">
        {liste.map((k) => (
          <li
            key={k.id}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div>
              <span className="font-medium text-[var(--foreground)]">{k.artikel}</span>
              <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                Größe {k.groesse} · {k.status} · {k.datum}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {showAnfrage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
              Neue Dienstkleidung anfragen
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)]">Artikel</label>
                <select
                  value={form.artikel}
                  onChange={(e) => setForm((f) => ({ ...f, artikel: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  <option>T-Shirt</option>
                  <option>Hose</option>
                  <option>Jacke</option>
                  <option>Schuhe</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)]">Größe</label>
                <input
                  type="text"
                  placeholder="z. B. M, 32"
                  value={form.groesse}
                  onChange={(e) => setForm((f) => ({ ...f, groesse: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnfrage(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] font-medium"
                >
                  Anfrage senden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
