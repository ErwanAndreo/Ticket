export default function ITPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">IT</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Kontaktdaten des aktuellen IT-Verantwortlichen bei Problemen mit der App.
      </p>
      <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          IT-Ansprechpartner
        </h2>
        <ul className="space-y-1 text-sm">
          <li><span className="text-[var(--muted-foreground)]">Name:</span> IT Support</li>
          <li><span className="text-[var(--muted-foreground)]">E-Mail:</span> it@example.org</li>
          <li><span className="text-[var(--muted-foreground)]">Telefon:</span> +49 123 459</li>
          <li>
            <a href="#" className="text-[var(--primary)] hover:underline">
              Ticket-System öffnen
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
