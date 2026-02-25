"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

const typen = [
  {
    value: "lehrgang",
    label: "Anfrage Lehrgang / Ausbildung (z.B. EH, SAN A)",
  },
  {
    value: "stoerung",
    label: "Störmeldung / Beschädigung (auch anonym meldbar)",
  },
] as const;

type TicketTyp = (typeof typen)[number]["value"];

type Ticket = {
  id: string;
  typ: TicketTyp;
  anonym: boolean;
  beschreibung: string;
  createdAt: string;
};

export default function TicketsPage() {
  const [typ, setTyp] = useState<TicketTyp>("lehrgang");
  const [anonym, setAnonym] = useState(false);
  const [beschreibung, setBeschreibung] = useState("");
  const [tickets, setTickets] = useLocalStorageState<Ticket[]>(
    "ticket-vbeide-tickets",
    []
  );

  const handleCreate = () => {
    if (!beschreibung.trim()) return;
    const neu: Ticket = {
      id: Date.now().toString(),
      typ,
      anonym,
      beschreibung: beschreibung.trim(),
      createdAt: new Date().toISOString(),
    };
    setTickets([neu, ...tickets]);
    setBeschreibung("");
    setAnonym(false);
    setTyp("lehrgang");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Ticketsystem
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Anfragen für Lehrgänge oder Störung/Beschädigung melden
      </p>

      <div className="max-w-xl space-y-6">
        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-semibold mb-4">Neues Ticket</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Art</label>
              <select
                value={typ}
                onChange={(e) => setTyp(e.target.value as TicketTyp)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
              >
                {typen.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            {typ === "stoerung" && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={anonym}
                  onChange={(e) => setAnonym(e.target.checked)}
                />
                <span className="text-sm">Anonym melden</span>
              </label>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Beschreibung
              </label>
              <textarea
                rows={4}
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
                placeholder="Details…"
              />
            </div>
            <button
              type="button"
              onClick={handleCreate}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
            >
              Ticket erstellen
            </button>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <h2 className="font-semibold mb-2">Offene Tickets</h2>
          {tickets.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              Noch keine Tickets.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {tickets.map((t) => (
                <li
                  key={t.id}
                  className="border border-[var(--border)] rounded-lg p-3"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="font-medium">
                        {t.typ === "lehrgang"
                          ? "Lehrgang / Ausbildung"
                          : "Störmeldung / Beschädigung"}
                      </div>
                      <p className="text-[var(--muted-foreground)] mt-1 whitespace-pre-line">
                        {t.beschreibung}
                      </p>
                    </div>
                    <div className="text-xs text-right text-[var(--muted-foreground)]">
                      {new Date(t.createdAt).toLocaleString("de-DE")}
                      {t.anonym && <div>Anonym</div>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
