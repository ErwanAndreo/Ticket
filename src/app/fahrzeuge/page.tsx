"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

const tabs = ["Übersicht", "TÜV", "Wartung", "Mängel", "Zubehör"] as const;

type Fahrzeug = {
  id: string;
  name: string;
  tuvBis?: string;
  naechsteWartung?: string;
  maengel?: string;
  zubehoer?: string;
};

export default function FahrzeugePage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Übersicht");
  const [fahrzeuge, setFahrzeuge] = useLocalStorageState<Fahrzeug[]>(
    "ticket-vbeide-fahrzeuge",
    []
  );
  const [form, setForm] = useState<Fahrzeug>({
    id: "",
    name: "",
    tuvBis: "",
    naechsteWartung: "",
    maengel: "",
    zubehoer: "",
  });

  const handleAdd = () => {
    if (!form.name) return;
    const neu: Fahrzeug = {
      ...form,
      id: Date.now().toString(),
    };
    setFahrzeuge([...fahrzeuge, neu]);
    setForm({
      id: "",
      name: "",
      tuvBis: "",
      naechsteWartung: "",
      maengel: "",
      zubehoer: "",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Fahrzeugübersichten
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        TÜV, Wartung, Mängellisten, mitgeführtes Zubehör
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              tab === t
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] text-[var(--foreground)] hover:opacity-90"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <h2 className="font-semibold">Neues Fahrzeug</h2>
          <input
            placeholder="Bezeichnung (z.B. MTW 1)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <input
            type="date"
            placeholder="TÜV bis"
            value={form.tuvBis}
            onChange={(e) => setForm({ ...form, tuvBis: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <input
            type="date"
            placeholder="Nächste Wartung"
            value={form.naechsteWartung}
            onChange={(e) =>
              setForm({ ...form, naechsteWartung: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <textarea
            placeholder="Mängel"
            value={form.maengel}
            onChange={(e) => setForm({ ...form, maengel: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
            rows={2}
          />
          <textarea
            placeholder="Zubehör (Laptop, HRTs …)"
            value={form.zubehoer}
            onChange={(e) => setForm({ ...form, zubehoer: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
            rows={2}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium"
          >
            Fahrzeug hinzufügen
          </button>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                  <th className="text-left p-3 font-medium">Fahrzeug</th>
                  {tab === "TÜV" && (
                    <th className="text-left p-3 font-medium">TÜV bis</th>
                  )}
                  {tab === "Wartung" && (
                    <th className="text-left p-3 font-medium">
                      Nächste Wartung
                    </th>
                  )}
                  {tab === "Mängel" && (
                    <th className="text-left p-3 font-medium">Mängel</th>
                  )}
                  {tab === "Zubehör" && (
                    <th className="text-left p-3 font-medium">
                      Zubehör (Laptop, HRTs…)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {fahrzeuge.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tab === "Übersicht" ? 1 : 2}
                      className="p-4 text-[var(--muted-foreground)] text-sm"
                    >
                      Noch keine Fahrzeuge hinterlegt.
                    </td>
                  </tr>
                ) : (
                  fahrzeuge.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-[var(--border)] align-top"
                    >
                      <td className="p-3">{f.name}</td>
                      {tab === "TÜV" && (
                        <td className="p-3">{f.tuvBis || "—"}</td>
                      )}
                      {tab === "Wartung" && (
                        <td className="p-3">
                          {f.naechsteWartung || "—"}
                        </td>
                      )}
                      {tab === "Mängel" && (
                        <td className="p-3 whitespace-pre-line">
                          {f.maengel || "—"}
                        </td>
                      )}
                      {tab === "Zubehör" && (
                        <td className="p-3 whitespace-pre-line">
                          {f.zubehoer || "—"}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-[var(--muted-foreground)] text-sm">
            {tab === "Übersicht" &&
              "Alle Fahrzeuge mit TÜV- und Wartungsstatus auf einen Blick (über die Tabs)."}
          </div>
        </div>
      </div>
    </div>
  );
}
