"use client";

import Link from "next/link";
import { useState } from "react";
import { STORAGE_KEYS, getItem, setItem } from "@/lib/storage";

export interface AntragEintrag {
  id: string;
  typ: string;
  titel: string;
  kategorie: string;
  status: string;
  datum: string;
  ort?: string;
  beschreibung?: string;
}

export default function SchadenMeldenPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    kurzbeschreibung: "",
    ort: "",
    beschreibung: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = getItem<AntragEintrag[]>(STORAGE_KEYS.ANTRAGE, []);
    const newEntry: AntragEintrag = {
      id: String(Date.now()),
      typ: "Schaden",
      titel: form.kurzbeschreibung.trim(),
      kategorie: "Schaden melden",
      status: "Eingereicht",
      datum: new Date().toISOString().slice(0, 10),
      ort: form.ort.trim() || undefined,
      beschreibung: form.beschreibung.trim() || undefined,
    };
    setItem(STORAGE_KEYS.ANTRAGE, [newEntry, ...stored]);
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link href="/antraege" className="text-sm text-[var(--primary)] hover:underline">
        ← Zurück zu Anträge
      </Link>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Schaden melden</h1>

      {sent ? (
        <div className="rounded-xl border border-green-300 bg-green-50 p-4">
          <p className="font-medium text-green-800">Meldung wurde abgeschickt.</p>
          <Link href="/antraege" className="mt-2 inline-block text-sm text-green-700 hover:underline">
            Zu den Anträgen
          </Link>
        </div>
      ) : (
        <form
          className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Kurzbeschreibung
            </label>
            <input
              type="text"
              required
              value={form.kurzbeschreibung}
              onChange={(e) => setForm((f) => ({ ...f, kurzbeschreibung: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Ort / betroffener Bereich
            </label>
            <input
              type="text"
              value={form.ort}
              onChange={(e) => setForm((f) => ({ ...f, ort: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)]">
              Beschreibung
            </label>
            <textarea
              rows={4}
              required
              value={form.beschreibung}
              onChange={(e) => setForm((f) => ({ ...f, beschreibung: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Schaden melden
          </button>
        </form>
      )}
    </div>
  );
}
