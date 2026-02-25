"use client";

import { useState } from "react";

const MEINE_ABSCHLUESSE = [
  { id: "1", name: "Erste-Hilfe-Grundkurs", datum: "2024-06-01" },
  { id: "2", name: "SAN-Grundausbildung", datum: "2024-09-15" },
];

const VERFUEGBARE_KURSE = [
  { id: "3", name: "SAN-Aufbau", kategorie: "SAN" },
  { id: "4", name: "Fahrer RTW", kategorie: "Fahrzeug" },
  { id: "5", name: "Technik Einführung", kategorie: "Technik" },
];

const BAUM = [
  { id: "a", label: "SAN", children: [{ id: "a1", label: "SAN-Grundausbildung" }, { id: "a2", label: "SAN-Aufbau" }] },
  { id: "b", label: "Fahrzeug", children: [{ id: "b1", label: "Fahrer KTW" }, { id: "b2", label: "Fahrer RTW" }] },
  { id: "c", label: "Technik", children: [{ id: "c1", label: "Technik Einführung" }] },
];

export default function AusbildungPage() {
  const [view, setView] = useState<"uebersicht" | "baum">("uebersicht");
  const [anmeldeHint, setAnmeldeHint] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {anmeldeHint && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">
          {anmeldeHint}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Ausbildung</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("uebersicht")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              view === "uebersicht" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--muted)] text-[var(--foreground)]"
            }`}
          >
            Übersicht
          </button>
          <button
            type="button"
            onClick={() => setView("baum")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              view === "baum" ? "bg-[var(--primary)] text-[var(--primary-foreground)]" : "bg-[var(--muted)] text-[var(--foreground)]"
            }`}
          >
            Baumansicht
          </button>
        </div>
      </div>

      {view === "uebersicht" && (
        <>
          <section>
            <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
              Deine Abschlüsse (in grün)
            </h2>
            <ul className="space-y-2">
              {MEINE_ABSCHLUESSE.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-green-300 bg-green-50 px-4 py-3"
                >
                  <span className="font-medium text-green-800">{a.name}</span>
                  <span className="ml-2 text-sm text-green-600">{a.datum}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
              Verfügbare Kurse (alles andere was du machen kannst)
            </h2>
            <ul className="space-y-2">
              {VERFUEGBARE_KURSE.map((k) => (
                <li
                  key={k.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                >
                  <span className="font-medium text-[var(--foreground)]">{k.name}</span>
                  <span className="ml-2 text-sm text-[var(--muted-foreground)]">{k.kategorie}</span>
                  <button
                    type="button"
                    onClick={() => { setAnmeldeHint("Anmeldung wird mit Backend verbunden."); setTimeout(() => setAnmeldeHint(null), 3000); }}
                    className="ml-2 text-sm text-[var(--primary)] hover:underline"
                  >
                    Anmelden
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {view === "baum" && (
        <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h2 className="mb-4 text-sm font-semibold text-[var(--muted-foreground)]">
            Baumansicht (Kategorien → Kurse)
          </h2>
          <ul className="space-y-2">
            {BAUM.map((node) => (
              <li key={node.id} className="pl-0">
                <span className="font-medium text-[var(--foreground)]">{node.label}</span>
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-[var(--border)] pl-3">
                  {node.children.map((c) => (
                    <li key={c.id} className="text-[var(--muted-foreground)]">
                      {c.label}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
