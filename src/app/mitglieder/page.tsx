"use client";

import { useState } from "react";

const MOCK_MITGLIEDER = [
  { id: "1", name: "Max Mustermann", email: "max@example.org", bereich: "SAN" },
  { id: "2", name: "Anna Schmidt", email: "anna@example.org", bereich: "Technik" },
  { id: "3", name: "Tom Weber", email: "tom@example.org", bereich: "SAN" },
  { id: "4", name: "Lisa Müller", email: "lisa@example.org", bereich: "Verpflegung" },
];

export default function MitgliederPage() {
  const [suche, setSuche] = useState("");

  const filtered = MOCK_MITGLIEDER.filter(
    (m) =>
      m.name.toLowerCase().includes(suche.toLowerCase()) ||
      m.email.toLowerCase().includes(suche.toLowerCase()) ||
      m.bereich.toLowerCase().includes(suche.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Mitglieder</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Alle Mitglieder im Überblick.
      </p>

      <input
        type="search"
        placeholder="Suchen (Name, E-Mail, Bereich) …"
        value={suche}
        onChange={(e) => setSuche(e.target.value)}
        className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
      />

      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <li
            key={m.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <p className="font-medium text-[var(--foreground)]">{m.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{m.email}</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{m.bereich}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
