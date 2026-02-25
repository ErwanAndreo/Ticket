const PREFIX = "ticket-vbeide-";

export const STORAGE_KEYS = {
  USER: PREFIX + "user",
  HELFERSTUNDEN: PREFIX + "helferstunden",
  SHORTCUTS: PREFIX + "shortcuts",
  AUFGABEN_TODOS: PREFIX + "aufgaben-todos",
  PINNWAND_AUFGABEN: PREFIX + "pinnwand-aufgaben",
  DIENSTKLEIDUNG: PREFIX + "dienstkleidung",
  ANTRAGE: PREFIX + "antraege",
} as const;

export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setItem(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}
