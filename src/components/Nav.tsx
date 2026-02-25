"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const modules = [
  { href: "/", label: "Dashboard", icon: "⌂" },
  { href: "/termine", label: "Termine", icon: "📅" },
  { href: "/personal", label: "Personalakten", icon: "👤" },
  { href: "/fahrzeuge", label: "Fahrzeuge", icon: "🚐" },
  { href: "/tickets", label: "Ticketsystem", icon: "🎫" },
  { href: "/verantwortliche", label: "Verantwortliche", icon: "📋" },
  { href: "/helferstunden", label: "Helferstunden", icon: "⏱" },
  { href: "/wachbuch", label: "Wachbuch", icon: "📖" },
  { href: "/antraege", label: "Anträge", icon: "📝" },
  { href: "/dienstkleidung", label: "Dienstkleidung", icon: "👕" },
  { href: "/aufgaben", label: "Aufgaben", icon: "✓" },
  { href: "/pinnwand", label: "Pinnwand", icon: "📌" },
  { href: "/mitglieder", label: "Mitglieder", icon: "👥" },
  { href: "/kalender", label: "Kalender", icon: "🗓" },
  { href: "/ausbildung", label: "Ausbildung", icon: "🎓" },
  { href: "/haussteuerung", label: "Haussteuerung", icon: "🏠" },
  { href: "/inventar", label: "Inventar", icon: "📦" },
  { href: "/dokumente", label: "Dokumente", icon: "📁" },
  { href: "/johanni", label: "Johanni", icon: "🌟" },
  { href: "/infos", label: "Infos", icon: "ℹ" },
  { href: "/it", label: "IT", icon: "💻" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 py-2">
      {modules.map(({ href, label, icon }) => {
        const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--sidebar-foreground)] hover:bg-white/10"
            }`}
          >
            <span className="text-lg" aria-hidden>{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
