"use client";

import { useLocalStorageState } from "@/lib/useLocalStorage";

type Termin = {
  id: string;
  titel: string;
  datum: string;
  uhrzeit: string;
  ressourcenTyp: "fahrzeug" | "raum";
  ressource: string;
  absicherung: string;
};

export default function KalenderPage() {
  const [termine] = useLocalStorageState<Termin[]>("ticket-vbeide-termine", []);

  const gruppiert = termine.reduce<Record<string, Termin[]>>((acc, t) => {
    if (!t.datum) return acc;
    acc[t.datum] = acc[t.datum] ? [...acc[t.datum], t] : [t];
    return acc;
  }, {});

  const tage = Object.entries(gruppiert).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Terminkalender
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Fahrzeuge und Räume im Kalender
      </p>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        {tage.length === 0 ? (
          <p className="text-[var(--muted-foreground)] text-sm">
            Noch keine Termine angelegt. Termine aus dem Bereich „Termine“
            erscheinen hier.
          </p>
        ) : (
          <div className="space-y-4">
            {tage.map(([datum, liste]) => (
              <div
                key={datum}
                className="border border-[var(--border)] rounded-lg"
              >
                <div className="px-4 py-2 border-b border-[var(--border)] font-medium">
                  {datum}
                </div>
                <ul className="divide-y divide-[var(--border)] text-sm">
                  {liste.map((t) => (
                    <li key={t.id} className="px-4 py-2 flex justify-between">
                      <div>
                        <div className="font-medium">{t.titel}</div>
                        <div className="text-[var(--muted-foreground)]">
                          {t.uhrzeit && `${t.uhrzeit} • `}
                          {t.ressourcenTyp === "fahrzeug" ? "Fahrzeug" : "Raum"}
                          : {t.ressource || "—"}
                        </div>
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        Absicherung: {t.absicherung}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
