export default function HaussteuerungPage() {
  const loxoneUrl = process.env.NEXT_PUBLIC_LOXONE_URL || "https://loxone.example.com";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Haussteuerung</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Loxone-Verknüpfung. Shortcuts auf diese Seite oder auf konkrete Aktionen (z. B. „Licht Büro an“) können in den Einstellungen angelegt werden.
      </p>
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <a
          href={loxoneUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 font-medium text-[var(--primary-foreground)] hover:opacity-90"
        >
          Loxone öffnen
          <span className="text-sm">↗</span>
        </a>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Link zur Loxone-Weboberfläche. API-Integration (Licht, Heizung in der App steuern) kann später ergänzt werden.
        </p>
      </section>
    </div>
  );
}
