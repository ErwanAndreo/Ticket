"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

type Verantwortlicher = {
  id: string;
  thema: string;
  name: string;
  email: string;
  tel: string;
};

export default function VerantwortlichePage() {
  const [liste, setListe] = useLocalStorageState<Verantwortlicher[]>(
    "ticket-vbeide-verantwortliche",
    []
  );
  const [form, setForm] = useState({
    thema: "",
    name: "",
    email: "",
    tel: "",
  });

  const handleAdd = () => {
    if (!form.thema || !form.name) return;
    const neu: Verantwortlicher = {
      id: Date.now().toString(),
      ...form,
    };
    setListe([...liste, neu]);
    setForm({ thema: "", name: "", email: "", tel: "" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Verantwortlichen-Liste
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Referate & Ansprechpartner mit E-Mail und Tel
      </p>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] mb-6">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)] space-y-3">
          <h2 className="font-semibold">Neuer Verantwortlicher</h2>
          <input
            placeholder="Referat / Thema"
            value={form.thema}
            onChange={(e) => setForm({ ...form, thema: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <input
            placeholder="E-Mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <input
            placeholder="Tel"
            value={form.tel}
            onChange={(e) => setForm({ ...form, tel: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium"
          >
            Hinzufügen
          </button>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/50">
                <th className="text-left p-3 font-medium">Referat / Thema</th>
                <th className="text-left p-3 font-medium">Ansprechpartner</th>
                <th className="text-left p-3 font-medium">E-Mail</th>
                <th className="text-left p-3 font-medium">Tel</th>
              </tr>
            </thead>
            <tbody>
              {liste.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-[var(--muted-foreground)] text-sm"
                  >
                    Noch keine Verantwortlichen hinterlegt.
                  </td>
                </tr>
              ) : (
                liste.map((v) => (
                  <tr key={v.id} className="border-b border-[var(--border)]">
                    <td className="p-3">{v.thema}</td>
                    <td className="p-3">{v.name}</td>
                    <td className="p-3">{v.email}</td>
                    <td className="p-3">{v.tel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
