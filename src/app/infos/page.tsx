const ANSPRECHPARTNER = [
  { kategorie: "Erste Hilfe", name: "Anna Schmidt", email: "anna@example.org", telefon: "+49 123 456" },
  { kategorie: "Technik", name: "Tom Weber", email: "tom@example.org", telefon: "+49 123 457" },
  { kategorie: "Verpflegung", name: "Lisa Müller", email: "lisa@example.org", telefon: "+49 123 458" },
];

export default function InfosPage() {
  const byCat = ANSPRECHPARTNER.reduce<Record<string, typeof ANSPRECHPARTNER>>((acc, a) => {
    if (!acc[a.kategorie]) acc[a.kategorie] = [];
    acc[a.kategorie].push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Infos</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Ansprechpartner für verschiedenes.
      </p>
      <div className="space-y-4">
        {Object.entries(byCat).map(([kat, list]) => (
          <section key={kat} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">{kat}</h2>
            <ul className="space-y-2">
              {list.map((a) => (
                <li key={a.email}>
                  <span className="font-medium text-[var(--foreground)]">{a.name}</span>
                  <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                    {a.email} · {a.telefon}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
