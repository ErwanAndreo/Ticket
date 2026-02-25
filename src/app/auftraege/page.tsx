export default function LaufendeAuftraegePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-[var(--foreground)]">
        Laufende Aufträge
      </h1>
      <p className="text-[var(--muted-foreground)]">
        Hier erscheinen Ihre laufenden Aufträge (Anträge in Bearbeitung, zugewiesene Termine, etc.).
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[var(--muted-foreground)]">
        <li>Keine laufenden Aufträge.</li>
      </ul>
    </div>
  );
}
