"use client";

import { useState, useEffect } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/lib/storage";

export interface Helferstunde {
  id: string;
  datum: string;
  dauer: number;
  taetigkeit: string;
  projekt: string;
}

const MOCK_STUNDEN: Helferstunde[] = [
  { id: "1", datum: "2025-02-20", dauer: 4, taetigkeit: "SAN Dienst", projekt: "Einsatz" },
  { id: "2", datum: "2025-02-18", dauer: 2, taetigkeit: "Schulung", projekt: "Ausbildung" },
  { id: "3", datum: "2025-02-15", dauer: 6, taetigkeit: "Veranstaltung", projekt: "Johanni" },
];

const PROJEKTE = ["Alle", "Einsatz", "Ausbildung", "Johanni"];

function loadStunden(): Helferstunde[] {
  const stored = getItem<Helferstunde[]>(STORAGE_KEYS.HELFERSTUNDEN, []);
  if (stored.length > 0) return stored;
  return MOCK_STUNDEN;
}

export default function HelferstundenPage() {
  const [stunden, setStunden] = useState<Helferstunde[]>([]);
  const [filterProjekt, setFilterProjekt] = useState("Alle");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    datum: new Date().toISOString().slice(0, 10),
    dauer: 2,
    taetigkeit: "",
    projekt: "Einsatz",
  });

  useEffect(() => {
    setStunden(loadStunden());
  }, []);

  const filtered =
    filterProjekt === "Alle"
      ? stunden
      : stunden.filter((s) => s.projekt === filterProjekt);

  const saveStunden = (next: Helferstunde[]) => {
    setStunden(next);
    setItem(STORAGE_KEYS.HELFERSTUNDEN, next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("ticket-vbeide-helferstunden-updated"));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: Helferstunde = {
      id: String(Date.now()),
      datum: form.datum,
      dauer: Number(form.dauer) || 0,
      taetigkeit: form.taetigkeit.trim() || "—",
      projekt: form.projekt,
    };
    saveStunden([newEntry, ...stunden]);
    setForm({
      datum: new Date().toISOString().slice(0, 10),
      dauer: 2,
      taetigkeit: "",
      projekt: "Einsatz",
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Helferstunden</h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            Automatisch bei Veranstaltungen, manuell bei eigenen Terminen
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium hover:opacity-90"
        >
          + Hinzufügen
        </button>
      </div>

      <div className="flex gap-2">
        {PROJEKTE.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilterProjekt(p)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              filterProjekt === p
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] text-[var(--foreground)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {filtered.map((s) => (
          <li
            key={s.id}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <span className="font-medium text-[var(--foreground)]">{s.taetigkeit}</span>
            <span className="text-sm text-[var(--muted-foreground)]">
              {s.datum} · {s.dauer} h · {s.projekt}
            </span>
          </li>
        ))}
      </ul>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
              Helferstunde erfassen
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)]">Datum</label>
                <input
                  type="date"
                  required
                  value={form.datum}
                  onChange={(e) => setForm((f) => ({ ...f, datum: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)]">Dauer (h)</label>
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  required
                  value={form.dauer}
                  onChange={(e) => setForm((f) => ({ ...f, dauer: Number(e.target.value) || 0 }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)]">Tätigkeit</label>
                <input
                  type="text"
                  value={form.taetigkeit}
                  onChange={(e) => setForm((f) => ({ ...f, taetigkeit: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)]">Projekt</label>
                <select
                  value={form.projekt}
                  onChange={(e) => setForm((f) => ({ ...f, projekt: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                >
                  <option>Einsatz</option>
                  <option>Ausbildung</option>
                  <option>Johanni</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="rounded-lg px-4 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] font-medium"
                >
                  Speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
