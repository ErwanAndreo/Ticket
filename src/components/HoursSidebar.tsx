"use client";

import { useState, useEffect } from "react";
import { STORAGE_KEYS, getItem } from "@/lib/storage";

interface Stunde { id: string; datum: string; dauer: number; taetigkeit?: string; projekt?: string }

const PERIODS = ["Tag", "Woche", "Monat", "Jahr"] as const;

function sumHoursForPeriod(stunden: Stunde[], period: (typeof PERIODS)[number]): number {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const startOfMonth = today.slice(0, 7) + "-01";
  const startOfYear = today.slice(0, 4) + "-01-01";

  const inRange = (d: string) => {
    if (period === "Tag") return d === today;
    if (period === "Woche") {
      const t = new Date(d).getTime();
      const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
      return t >= weekAgo && t <= now.getTime();
    }
    if (period === "Monat") return d >= startOfMonth && d <= today;
    if (period === "Jahr") return d >= startOfYear && d <= today;
    return false;
  };
  return stunden.filter((s) => inRange(s.datum)).reduce((sum, s) => sum + (s.dauer || 0), 0);
}

export function HoursSidebar() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Monat");
  const [hours, setHours] = useState(0);

  const refresh = () => {
    const stunden = getItem<Stunde[]>(STORAGE_KEYS.HELFERSTUNDEN, []);
    setHours(sumHoursForPeriod(stunden, period));
  };

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    window.addEventListener("ticket-vbeide-helferstunden-updated", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("ticket-vbeide-helferstunden-updated", handler);
    };
  }, [period]);

  useEffect(() => {
    refresh();
  }, [period]);

  return (
    <aside className="w-56 shrink-0 border-l border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="mb-2 text-sm font-semibold text-[var(--foreground)]">Gemachte Stunden</h3>
      <div className="mb-3 flex gap-1 rounded-xl bg-[var(--muted)] p-1">
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`flex-1 rounded px-2 py-1 text-xs font-medium ${
              period === p
                ? "bg-[var(--card)] text-[var(--foreground)] shadow"
                : "text-[var(--muted-foreground)]"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)]">{hours} h</p>
    </aside>
  );
}
