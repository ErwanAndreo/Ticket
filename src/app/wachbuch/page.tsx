"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

type WachbuchEintrag = {
  id: string;
  datum: string;
  text: string;
};

export default function WachbuchPage() {
  const [eintraege, setEintraege] = useLocalStorageState<WachbuchEintrag[]>(
    "ticket-vbeide-wachbuch",
    []
  );
  const [datum, setDatum] = useState("");
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!datum || !text.trim()) return;
    const neu: WachbuchEintrag = {
      id: Date.now().toString(),
      datum,
      text: text.trim(),
    };
    setEintraege([neu, ...eintraege]);
    setDatum("");
    setText("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Wachbuch
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Dienst- und Einsatzprotokoll
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden mb-6">
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
          <span className="font-medium">Neuer Eintrag</span>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="date"
            value={datum}
            onChange={(e) => setDatum(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
          />
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Kurzbeschreibung des Dienstes / Einsatzes…"
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium"
          >
            + Eintrag
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
          <span className="font-medium">Einträge</span>
        </div>
        {eintraege.length === 0 ? (
          <div className="p-6 text-[var(--muted-foreground)] text-sm">
            Noch keine Wachbuch-Einträge. Hier können Dienste und Vorkommnisse
            protokolliert werden.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border)] text-sm">
            {eintraege.map((e) => (
              <li key={e.id} className="p-4">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  {e.datum}
                </div>
                <div className="whitespace-pre-line">{e.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
