"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

const absicherungOptions = ["BF", "SR", "SAN B", "—"] as const;

type Termin = {
  id: string;
  titel: string;
  datum: string;
  uhrzeit: string;
  ressourcenTyp: "fahrzeug" | "raum";
  ressource: string;
  absicherung: (typeof absicherungOptions)[number];
};

export default function TerminePage() {
  const [showForm, setShowForm] = useState(false);
  const [termine, setTermine] = useLocalStorageState<Termin[]>("ticket-vbeide-termine", []);
  const [form, setForm] = useState({
    titel: "",
    datum: "",
    uhrzeit: "",
    ressourcenTyp: "fahrzeug" as "fahrzeug" | "raum",
    ressource: "",
    absicherung: absicherungOptions[0] as (typeof absicherungOptions)[number],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titel || !form.datum) return;
    const neu: Termin = {
      id: Date.now().toString(),
      ...form,
    };
    setTermine([...termine, neu]);
    setForm({
      titel: "",
      datum: "",
      uhrzeit: "",
      ressourcenTyp: "fahrzeug",
      ressource: "",
      absicherung: absicherungOptions[0],
    });
    setShowForm(false);
  };

  const sortedTermine = [...termine].sort((a, b) =>
    (a.datum + a.uhrzeit).localeCompare(b.datum + b.uhrzeit)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Termine</h1>
          <p className="text-[var(--muted-foreground)]">
            Buchung Fahrzeuge & Räume, Zuteilung Absicherung
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90"
        >
          {showForm ? "Abbrechen" : "+ Neuer Termin"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-4 max-w-xl"
        >
          <h2 className="font-semibold">Neuer Termin</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Titel</label>
            <input
              type="text"
              value={form.titel}
              onChange={(e) => setForm({ ...form, titel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              placeholder="z.B. Übungsdienst"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Datum</label>
              <input
                type="date"
                value={form.datum}
                onChange={(e) => setForm({ ...form, datum: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Uhrzeit</label>
              <input
                type="time"
                value={form.uhrzeit}
                onChange={(e) => setForm({ ...form, uhrzeit: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Art</label>
              <select
                value={form.ressourcenTyp}
                onChange={(e) =>
                  setForm({
                    ...form,
                    ressourcenTyp: e.target.value as "fahrzeug" | "raum",
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              >
                <option value="fahrzeug">Fahrzeug</option>
                <option value="raum">Raum</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {form.ressourcenTyp === "fahrzeug"
                  ? "Fahrzeug wählen"
                  : "Raum wählen"}
              </label>
              <input
                type="text"
                value={form.ressource}
                onChange={(e) => setForm({ ...form, ressource: e.target.value })}
                placeholder={
                  form.ressourcenTyp === "fahrzeug"
                    ? "z.B. MTW 1"
                    : "z.B. Schulungsraum"
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Absicherung (Zuteilung)
            </label>
            <select
              value={form.absicherung}
              onChange={(e) =>
                setForm({
                  ...form,
                  absicherung: e.target.value as (typeof absicherungOptions)[number],
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
            >
              {absicherungOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
          >
            Termin anlegen
          </button>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] font-medium">
          Kommende Termine
        </div>
        {sortedTermine.length === 0 ? (
          <div className="p-6 text-[var(--muted-foreground)] text-sm">
            Noch keine Termine. Erstelle einen neuen Termin.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {sortedTermine.map((t) => (
              <li key={t.id} className="p-4 flex justify-between gap-4 text-sm">
                <div>
                  <div className="font-medium">{t.titel}</div>
                  <div className="text-[var(--muted-foreground)]">
                    {t.datum} {t.uhrzeit && `• ${t.uhrzeit}`} •{" "}
                    {t.ressourcenTyp === "fahrzeug" ? "Fahrzeug" : "Raum"}:{" "}
                    {t.ressource || "—"}
                  </div>
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  Absicherung: {t.absicherung}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
