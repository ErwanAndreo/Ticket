"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { STORAGE_KEYS, getItem, setItem } from "@/lib/storage";

interface TodoItem {
  id: string;
  titel: string;
  erledigt: boolean;
}

const MOCK_ZUGEWIESEN = [
  { id: "1", titel: "Protokoll Besprechung schreiben", von: "Anna Schmidt", frist: "2025-02-25", erledigt: false },
  { id: "2", titel: "Materialliste prüfen", von: "Tom Weber", frist: "2025-02-28", erledigt: false },
];

const DEFAULT_TODOS: TodoItem[] = [
  { id: "t1", titel: "Erste-Hilfe-Koffer nachfüllen", erledigt: false },
  { id: "t2", titel: "Fahrzeug-Check vor Dienst", erledigt: true },
];

function loadTodos(): TodoItem[] {
  const stored = getItem<TodoItem[]>(STORAGE_KEYS.AUFGABEN_TODOS, []);
  if (stored.length > 0) return stored;
  return DEFAULT_TODOS;
}

export default function AufgabenPage() {
  getCurrentUser();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [neuTitel, setNeuTitel] = useState("");

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  const saveTodos = (next: TodoItem[]) => {
    setTodos(next);
    setItem(STORAGE_KEYS.AUFGABEN_TODOS, next);
  };

  const addTodo = () => {
    if (!neuTitel.trim()) return;
    const next = [...todos, { id: "t" + Date.now(), titel: neuTitel.trim(), erledigt: false }];
    saveTodos(next);
    setNeuTitel("");
  };

  const toggleTodo = (id: string) => {
    saveTodos(
      todos.map((t) => (t.id === id ? { ...t, erledigt: !t.erledigt } : t))
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Aufgaben</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Deine eigenen Aufgaben: selbst angelegte Todos und dir zugewiesene.
      </p>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Dir zugewiesen
        </h2>
        <ul className="space-y-2">
          {MOCK_ZUGEWIESEN.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <div>
                <span className="font-medium text-[var(--foreground)]">{a.titel}</span>
                <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                  von {a.von} · Frist {a.frist}
                </span>
              </div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                Offen
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-[var(--muted-foreground)]">
          Deine Todos
        </h2>
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            placeholder="Neues Todo …"
            value={neuTitel}
            onChange={(e) => setNeuTitel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-[var(--foreground)]"
          />
          <button
            type="button"
            onClick={addTodo}
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm text-[var(--primary-foreground)] font-medium"
          >
            Hinzufügen
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3"
            >
              <input
                type="checkbox"
                checked={t.erledigt}
                onChange={() => toggleTodo(t.id)}
                className="rounded border-[var(--border)]"
              />
              <span
                className={
                  t.erledigt ? "text-[var(--muted-foreground)] line-through" : "text-[var(--foreground)]"
                }
              >
                {t.titel}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
