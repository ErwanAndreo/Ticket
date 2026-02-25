const ANSPRECHPARTNER = [
  { bereich: "Leitung", name: "Max Mustermann", email: "max@example.org" },
  { bereich: "SAN", name: "Anna Schmidt", email: "anna@example.org" },
  { bereich: "Technik", name: "Tom Weber", email: "tom@example.org" },
];

export default function JohanniPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Johanni</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Ansprechpartner und alles relevante für die Veranstaltung.
      </p>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Ansprechpartner
        </h2>
        <ul className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          {ANSPRECHPARTNER.map((a) => (
            <li key={a.email}>
              <span className="font-medium text-[var(--foreground)]">{a.name}</span>
              <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                {a.bereich} · {a.email}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Plan / Veranstaltung
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Zeitplan, Lageplan, Diensteinteilung und Dokumente (Download oder eingebettet).
        </p>
        <div className="mt-2 rounded-xl border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted-foreground)]">
          Dokumente und Pläne können hier eingebunden werden.
        </div>
      </section>
    </div>
  );
}
