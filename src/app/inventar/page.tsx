"use client";

import { useState, useEffect } from "react";
import { hasPermission } from "@/lib/auth";

const KATEGORIEN = ["SAN", "Technik", "Verpflegung"];

const MOCK_ARTIKEL = [
  { id: "1", name: "Verbandskasten", kategorie: "SAN", soll: 5, ist: 4, ort: "Lager A", zustand: "gut" },
  { id: "2", name: "Defi", kategorie: "SAN", soll: 2, ist: 2, ort: "RTW", zustand: "gut" },
  { id: "3", name: "Kabeltrommel", kategorie: "Technik", soll: 3, ist: 2, ort: "Technik", zustand: "beschädigt" },
];

export default function InventarPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"ueberblick" | "fehlen" | "scan">("ueberblick");
  const [mobileView, setMobileView] = useState<"soll" | "ist">("soll");
  const [kategorie, setKategorie] = useState("SAN");
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    setAllowed(hasPermission("inventar"));
  }, []);

  if (allowed === null) return <p className="text-[var(--muted-foreground)]">Lade…</p>;
  if (!allowed)
    return (
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Inventar</h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Sie haben keine Berechtigung für den Zugriff auf das Inventar.
        </p>
      </div>
    );

  const filtered = MOCK_ARTIKEL.filter((a) => a.kategorie === kategorie);
  const fehlend = filtered.filter((a) => a.ist < a.soll);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Inventar</h1>

      {hint && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)]">
          {hint}
        </div>
      )}
      <div className="flex gap-2">
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

      <div className="hidden gap-2 md:flex">
        {(["ueberblick", "fehlen", "scan"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              tab === t
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] text-[var(--foreground)]"
            }`}
          >
            {t === "ueberblick" ? "Überblick" : t === "fehlen" ? "Fehlen" : "Zustand einscannen"}
          </button>
        ))}
      </div>

      <div className="flex gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setMobileView("soll")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            mobileView === "soll"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--muted)] text-[var(--foreground)]"
          }`}
        >
          Soll
        </button>
        <button
          type="button"
          onClick={() => setMobileView("ist")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium ${
            mobileView === "ist"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--muted)] text-[var(--foreground)]"
          }`}
        >
          Ist
        </button>
      </div>

      {tab === "ueberblick" && (
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="py-2 text-left font-medium">Artikel</th>
                <th className="py-2 text-right">Soll</th>
                <th className="py-2 text-right">Ist</th>
                <th className="py-2 text-left">Ort</th>
                <th className="py-2 text-left">Zustand</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-[var(--border)]">
                  <td className="py-2">{a.name}</td>
                  <td className="text-right">{a.soll}</td>
                  <td className="text-right">{a.ist}</td>
                  <td>{a.ort}</td>
                  <td>{a.zustand}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "fehlen" && (
        <section className="hidden space-y-4 md:block">
          <p className="text-sm text-[var(--muted-foreground)]">
            Fehlende Artikel (Soll − Ist). Bedarf aufschreiben, Verknüpfungen für Bestellungen.
          </p>
          <ul className="space-y-2">
            {fehlend.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-3"
              >
                <span className="font-medium text-amber-800">
                  {a.name} (fehlt: {a.soll - a.ist})
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setHint("Noch keine Anbindung – kommt mit Backend."); setTimeout(() => setHint(null), 3000); }}
                    className="text-sm text-[var(--muted-foreground)] hover:underline"
                  >
                    Bedarf notieren
                  </button>
                  <button
                    type="button"
                    onClick={() => { setHint("Bestellung – kommt mit Backend."); setTimeout(() => setHint(null), 3000); }}
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    Bestellung
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tab === "scan" && (
        <section className="hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 md:block">
          <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
            Zustand einscannen
          </h2>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            Barcode/QR scannen, dann Zustand erfassen (gut / beschädigt / …). Foto optional.
          </p>
          <input
            type="text"
            placeholder="Barcode oder QR eingeben / scannen"
            className="mb-3 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
          />
          <div className="flex gap-2">
            {["gut", "beschädigt", "defekt"].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => { setHint("Zustand „" + z + "“ – kommt mit Backend."); setTimeout(() => setHint(null), 3000); }}
                className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm hover:opacity-90"
              >
                {z}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="md:hidden">
        <ul className="space-y-2">
          {filtered.map((a) => (
            <li
              key={a.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
            >
              <span className="font-medium">{a.name}</span>
              <span className="ml-2 font-medium">
                {mobileView === "soll" ? a.soll : a.ist}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
