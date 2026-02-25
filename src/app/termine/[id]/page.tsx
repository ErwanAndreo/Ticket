"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

const MOCK_TERMIN: Record<
  string,
  { title: string; date: string; time: string; ort: string; besetzung: { name: string; rolle: string }[]; fahrzeuge: string[] }
> = {
  "1": {
    title: "Einsatz Besprechung",
    date: "2025-02-24",
    time: "10:00",
    ort: "Büro",
    besetzung: [
      { name: "Max Mustermann", rolle: "Leitung" },
      { name: "Anna Schmidt", rolle: "Protokoll" },
    ],
    fahrzeuge: ["KTW 1", "ELW 2"],
  },
  "2": {
    title: "SAN Dienst",
    date: "2025-02-25",
    time: "08:00",
    ort: "SAN-Station",
    besetzung: [
      { name: "Max Mustermann", rolle: "SAN" },
      { name: "Anna Schmidt", rolle: "Fahrer" },
    ],
    fahrzeuge: ["RTW 1", "KTW 1"],
  },
  "3": {
    title: "Technik Check",
    date: "2025-02-26",
    time: "14:00",
    ort: "Technik",
    besetzung: [{ name: "Tom Weber", rolle: "Technik" }],
    fahrzeuge: [],
  },
  "4": {
    title: "Helfer-Schulung",
    date: "2025-03-01",
    time: "09:00",
    ort: "Schulungsraum",
    besetzung: [],
    fahrzeuge: [],
  },
};

export default function TerminDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const termin = MOCK_TERMIN[id];
  if (!termin) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/termine" className="text-sm text-[var(--primary)] hover:underline">
        ← Zurück zu Termine
      </Link>
      <h1 className="text-2xl font-bold text-[var(--foreground)]">{termin.title}</h1>
      <p className="text-[var(--muted-foreground)]">
        {termin.date} {termin.time} · {termin.ort}
      </p>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">Besetzung</h2>
        {termin.besetzung.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Keine Besetzung eingetragen.</p>
        ) : (
          <ul className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
            {termin.besetzung.map((b, i) => (
              <li key={i} className="flex justify-between border-b border-[var(--border)] px-4 py-2 last:border-0">
                <span className="text-[var(--foreground)]">{b.name}</span>
                <span className="text-[var(--muted-foreground)]">{b.rolle}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">Fahrzeuge</h2>
        {termin.fahrzeuge.length === 0 ? (
          <p className="text-sm text-[var(--muted-foreground)]">Keine Fahrzeuge zugewiesen.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {termin.fahrzeuge.map((f) => (
              <li
                key={f}
                className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm"
              >
                {f}
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-[var(--muted-foreground)]">
        Hiorg-ähnliche Anzeige: Besetzung und Fahrzeuge (nur Anzeige, ggf. später Link zu externem System).
      </p>
    </div>
  );
}
