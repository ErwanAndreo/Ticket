"use client";

import { getCurrentUser, saveUser } from "@/lib/auth";
import { useState, useEffect } from "react";

export default function ProfilPage() {
  const user = getCurrentUser();
  const [visible, setVisible] = useState({
    name: true,
    email: true,
    telefon: true,
  });
  const [edit, setEdit] = useState({ telefon: "", notfall: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setVisible(u.visible ?? { name: true, email: true, telefon: true });
    setEdit({ telefon: u.telefon ?? "", notfall: u.notfall ?? "" });
  }, []);

  const handleSave = () => {
    saveUser({
      visible,
      telefon: edit.telefon || undefined,
      notfall: edit.notfall || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Profil</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Daten ein- und ausblenden für alle. Daten abändern.
      </p>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--muted-foreground)]">
          Sichtbarkeit für alle
        </h2>
        <ul className="space-y-2">
          {["name", "email", "telefon"].map((key) => (
            <li key={key} className="flex items-center justify-between">
              <span className="text-[var(--foreground)]">
                {key === "name" ? "Name" : key === "email" ? "E-Mail" : "Telefon"}
              </span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={visible[key as keyof typeof visible]}
                  onChange={(e) =>
                    setVisible((v) => ({ ...v, [key]: e.target.checked }))
                  }
                  className="rounded border-[var(--border)]"
                />
                anzeigen
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="mb-3 text-sm font-semibold text-[var(--muted-foreground)]">
          Daten bearbeiten
        </h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-[var(--muted-foreground)]">Name (aus AD)</label>
            <p className="font-medium text-[var(--foreground)]">{user.displayName}</p>
          </div>
          <div>
            <label className="block text-sm text-[var(--muted-foreground)]">E-Mail (aus AD)</label>
            <p className="font-medium text-[var(--foreground)]">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm text-[var(--muted-foreground)]">Telefon</label>
            <input
              type="tel"
              value={edit.telefon}
              onChange={(e) => setEdit((prev) => ({ ...prev, telefon: e.target.value }))}
              placeholder="Optional"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--muted-foreground)]">Notfallkontakt</label>
            <input
              type="text"
              value={edit.notfall}
              onChange={(e) => setEdit((prev) => ({ ...prev, notfall: e.target.value }))}
              placeholder="Optional"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
            />
          </div>
          {saved && (
            <p className="text-sm font-medium text-green-600">Gespeichert.</p>
          )}
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)]"
          >
            Speichern
          </button>
        </div>
      </section>
    </div>
  );
}
