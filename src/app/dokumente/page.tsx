"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

type Dokument = {
  id: string;
  name: string;
  kategorie: string;
};

export default function DokumentePage() {
  const [dokumente, setDokumente] = useLocalStorageState<Dokument[]>(
    "ticket-vbeide-dokumente",
    []
  );
  const [kategorie, setKategorie] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const neu: Dokument = {
      id: Date.now().toString(),
      name: file.name,
      kategorie,
    };
    setDokumente([...dokumente, neu]);
    setKategorie("");
    e.target.value = "";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Dokumentenablage
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Fotos, Dokumente ablegen und zuordnen
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 mb-6">
        <p className="text-[var(--muted-foreground)] mb-4 text-sm">
          Dokumente und Fotos werden hier nicht wirklich hochgeladen, aber du
          kannst sie als Einträge mit Namen und Kategorie erfassen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium">
              Kategorie / Ordner
            </label>
            <input
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              placeholder="z.B. Veranstaltungen, Ausbildung, Fahrzeug XY"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Datei auswählen
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="font-semibold mb-2">Ablage</h2>
        {dokumente.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">
            Noch keine Dokumente erfasst.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {dokumente.map((d) => (
              <li
                key={d.id}
                className="border border-[var(--border)] rounded-lg px-3 py-2 flex justify-between gap-4"
              >
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-[var(--muted-foreground)]">
                    {d.kategorie || "Ohne Kategorie"}
                  </div>
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  (lokaler Demo-Eintrag)
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
