"use client";

import { useState, useEffect } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/lib/storage";

export interface ShortcutItem {
  href: string;
  label: string;
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [{ href: "/ausbildung", label: "Ausbildung" }];

export default function EinstellungenPage() {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newHref, setNewHref] = useState("");
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    const stored = getItem<ShortcutItem[]>(STORAGE_KEYS.SHORTCUTS, []);
    setShortcuts(stored.length > 0 ? stored : DEFAULT_SHORTCUTS);
  }, []);

  const saveShortcuts = (next: ShortcutItem[]) => {
    setShortcuts(next);
    setItem(STORAGE_KEYS.SHORTCUTS, next);
  };

  const addShortcut = () => {
    const href = newHref.trim();
    const label = newLabel.trim() || href;
    if (!href) return;
    saveShortcuts([...shortcuts, { href: href.startsWith("/") || href.startsWith("http") ? href : "/" + href, label }]);
    setNewHref("");
    setNewLabel("");
    setShowAdd(false);
  };

  const removeShortcut = (index: number) => {
    saveShortcuts(shortcuts.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Einstellungen</h1>
      <section id="shortcuts" className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Shortcuts
        </h2>
        <p className="mb-3 text-sm text-[var(--muted-foreground)]">
          Eigene Shortcuts hinzufügen (Menüpunkte oder externe Links).
        </p>
        <ul className="space-y-2">
          {shortcuts.map((s, i) => (
            <li
              key={`${s.href}-${i}`}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2"
            >
              <a href={s.href} className="font-medium text-[var(--foreground)] hover:underline">
                {s.label}
              </a>
              <span className="text-xs text-[var(--muted-foreground)]">{s.href}</span>
              <button
                type="button"
                onClick={() => removeShortcut(i)}
                className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Entfernen
              </button>
            </li>
          ))}
        </ul>
        {!showAdd ? (
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="mt-3 rounded-lg border border-dashed border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)] hover:border-[var(--primary)]"
          >
            + Shortcut hinzufügen
          </button>
        ) : (
          <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-3">
            <div>
              <label className="block text-xs text-[var(--muted-foreground)]">Link (z. B. /termine oder https://…)</label>
              <input
                type="text"
                value={newHref}
                onChange={(e) => setNewHref(e.target.value)}
                placeholder="/termine"
                className="mt-0.5 w-48 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)]">Anzeigename</label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Termine"
                className="mt-0.5 w-36 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-sm"
              />
            </div>
            <button
              type="button"
              onClick={addShortcut}
              className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm text-[var(--primary-foreground)]"
            >
              Hinzufügen
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setNewHref(""); setNewLabel(""); }}
              className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted-foreground)]"
            >
              Abbrechen
            </button>
          </div>
        )}
      </section>
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Weitere Einstellungen
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">Weitere Optionen folgen.</p>
      </section>
    </div>
  );
}
