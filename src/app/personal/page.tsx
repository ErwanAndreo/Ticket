"use client";

import { useState } from "react";
import { useLocalStorageState } from "@/lib/useLocalStorage";

type Profil = {
  name: string;
  wohnort: string;
  notfallkontakt: string;
  ausbildungen: string;
  fuehrerscheine: string;
};

export default function PersonalPage() {
  const [tab, setTab] = useState<"info" | "ausbildung" | "führerschein">(
    "info"
  );
  const [profil, setProfil] = useLocalStorageState<Profil>("ticket-vbeide-profil", {
    name: "",
    wohnort: "",
    notfallkontakt: "",
    ausbildungen: "",
    fuehrerscheine: "",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
        Personalakten
      </h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Allgemeine Infos, Ausbildungen, Führerscheine
      </p>

      <div className="flex gap-2 mb-6 border-b border-[var(--border)]">
        {(["info", "ausbildung", "führerschein"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              tab === t
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            }`}
          >
            {t === "info" && "Allgemein"}
            {t === "ausbildung" && "Ausbildungen"}
            {t === "führerschein" && "Führerscheine"}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {tab === "info" && (
          <div className="p-6 space-y-4">
            <h2 className="font-semibold">Allgemeine Infos</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              Alter, Wohnort, Notfallkontakt usw.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
                  placeholder="Name"
                  value={profil.name}
                  onChange={(e) =>
                    setProfil({ ...profil, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Wohnort</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
                  placeholder="Ort"
                  value={profil.wohnort}
                  onChange={(e) =>
                    setProfil({ ...profil, wohnort: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Notfallkontakt</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)]"
                  placeholder="Name, Tel"
                  value={profil.notfallkontakt}
                  onChange={(e) =>
                    setProfil({
                      ...profil,
                      notfallkontakt: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
        {tab === "ausbildung" && (
          <div className="p-6 space-y-4">
            <h2 className="font-semibold">Ausbildungen</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              z.B. Kettensägenschein, SR, SAN B (durch Komma getrennt)
            </p>
            <input
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
              placeholder="SAN B, SR, Kettensägenschein, EH"
              value={profil.ausbildungen}
              onChange={(e) =>
                setProfil({
                  ...profil,
                  ausbildungen: e.target.value,
                })
              }
            />
            <div className="flex flex-wrap gap-2">
              {profil.ausbildungen
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
                .map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1 rounded-full bg-[var(--muted)] text-sm"
                  >
                    {a}
                  </span>
                ))}
            </div>
          </div>
        )}
        {tab === "führerschein" && (
          <div className="p-6 space-y-4">
            <h2 className="font-semibold">Führerscheine</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              B, BE, CE usw. (durch Komma getrennt)
            </p>
            <input
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
              placeholder="B, BE, CE, C1"
              value={profil.fuehrerscheine}
              onChange={(e) =>
                setProfil({
                  ...profil,
                  fuehrerscheine: e.target.value,
                })
              }
            />
            <div className="flex flex-wrap gap-2">
              {profil.fuehrerscheine
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean)
                .map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 rounded-full bg-[var(--muted)] text-sm"
                  >
                    {f}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
