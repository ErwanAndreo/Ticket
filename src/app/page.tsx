"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { STORAGE_KEYS, getItem } from "@/lib/storage";

const AUTO_SHORTCUTS = [
  { href: "/termine", label: "Termine" },
  { href: "/helferstunden", label: "Helferstunden" },
  { href: "/antraege", label: "Anträge" },
];

const DEFAULT_CUSTOM: { href: string; label: string }[] = [{ href: "/ausbildung", label: "Ausbildung" }];

const MODULES_GRID = [
  { href: "/termine", label: "Termine", desc: "Buchung Fahrzeuge & Räume, Zuteilung (BF, SR, SAN B)", icon: "📅" },
  { href: "/personal", label: "Personalakten", desc: "Infos, Ausbildungen, Führerscheine", icon: "👤" },
  { href: "/fahrzeuge", label: "Fahrzeuge", desc: "TÜV, Wartung, Mängel, Zubehör", icon: "🚐" },
  { href: "/tickets", label: "Ticketsystem", desc: "Lehrgänge, Störung/Beschädigung (auch anonym)", icon: "🎫" },
  { href: "/verantwortliche", label: "Verantwortliche", desc: "Referate & Ansprechpartner (E-Mail, Tel)", icon: "📋" },
  { href: "/helferstunden", label: "Helferstunden", desc: "Automatisch bei Veranstaltungen, manuell bei Terminen", icon: "⏱" },
  { href: "/wachbuch", label: "Wachbuch", desc: "Dienst- und Einsatzprotokoll", icon: "📖" },
  { href: "/inventar", label: "Inventar", desc: "Inkl. SAN-Material", icon: "📦" },
  { href: "/kalender", label: "Kalender", desc: "Fahrzeuge und Räume", icon: "🗓" },
  { href: "/dokumente", label: "Dokumente", desc: "Fotos, Ablagen", icon: "📁" },
  { href: "/antraege", label: "Anträge", desc: "Schaden melden, Urlaub, Material", icon: "📝" },
  { href: "/aufgaben", label: "Aufgaben", desc: "Todos und Zuweisungen", icon: "✓" },
];

const MOCK_TERMINE = [
  { id: "1", title: "Einsatz Besprechung", date: "2025-02-24", time: "10:00" },
  { id: "2", title: "SAN Dienst", date: "2025-02-25", time: "08:00" },
  { id: "3", title: "Technik Check", date: "2025-02-26", time: "14:00" },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const [search, setSearch] = useState("");
  const [customShortcuts, setCustomShortcuts] = useState<{ href: string; label: string }[]>(DEFAULT_CUSTOM);

  useEffect(() => {
    const stored = getItem<{ href: string; label: string }[]>(STORAGE_KEYS.SHORTCUTS, []);
    setCustomShortcuts(stored.length > 0 ? stored : DEFAULT_CUSTOM);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push("/suche?q=" + encodeURIComponent(search.trim()));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
          Hallo {user.displayName}
        </h1>
        <p className="text-[var(--muted-foreground)] mb-4">
          Willkommen im Ticket V-Beide. Wähle einen Bereich oder nutze die Suche.
        </p>

        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="search" className="sr-only">Suche</label>
          <input
            id="search"
            type="search"
            placeholder="Suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </form>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Shortcuts</h2>
        <div className="flex flex-wrap gap-2">
          {AUTO_SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-block rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:border-[var(--primary)] transition-colors"
            >
              {s.label}
            </Link>
          ))}
          {customShortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-block rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)]"
            >
              {s.label}
            </Link>
          ))}
          <Link
            href="/einstellungen#shortcuts"
            className="inline-block rounded-xl border-2 border-dashed border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            + Eigene legen
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-[var(--foreground)]">Bereiche</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES_GRID.map(({ href, label, desc, icon }) => (
            <Link
              key={href}
              href={href}
              className="block p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:shadow-md transition-all"
            >
              <span className="text-2xl mb-2 block" aria-hidden>{icon}</span>
              <h2 className="font-semibold text-[var(--foreground)]">{label}</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Nächste Termine</h2>
        <ul className="space-y-2">
          {MOCK_TERMINE.map((t) => (
            <li key={t.id}>
              <Link
                href={`/termine/${t.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 hover:border-[var(--primary)] transition-colors"
              >
                <span className="font-medium text-[var(--foreground)]">{t.title}</span>
                <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                  {t.date} {t.time}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
