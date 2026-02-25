import { STORAGE_KEYS, getItem, setItem } from "./storage";

/**
 * Auth placeholder – für spätere Active-Directory-Anbindung.
 * Aktuell: Mock-User für Entwicklung.
 */
export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  roles: string[];
  /** Profilfelder (persistiert in localStorage) */
  telefon?: string;
  notfall?: string;
  visible?: { name: boolean; email: boolean; telefon: boolean };
}

export const MOCK_USER: User = {
  id: "1",
  displayName: "Max Mustermann",
  email: "max@example.org",
  avatarUrl: undefined,
  roles: ["helfer"],
  visible: { name: true, email: true, telefon: true },
};

export function getCurrentUser(): User {
  const base = MOCK_USER;
  if (typeof window !== "undefined") {
    try {
      const stored = getItem<Partial<User>>(STORAGE_KEYS.USER, {});
      if (stored && (stored.telefon !== undefined || stored.notfall !== undefined || stored.visible)) {
        return {
          ...base,
          ...stored,
          displayName: stored.displayName ?? base.displayName,
          email: stored.email ?? base.email,
          id: stored.id ?? base.id,
          roles: stored.roles ?? base.roles,
          visible: stored.visible ?? base.visible ?? { name: true, email: true, telefon: true },
        };
      }
    } catch {
      // ignore
    }
  }
  return base;
}

export function saveUser(updates: Partial<User>): void {
  const current = getCurrentUser();
  const merged: User = {
    ...current,
    ...updates,
    visible: updates.visible ?? current.visible ?? { name: true, email: true, telefon: true },
  };
  setItem(STORAGE_KEYS.USER, merged);
}

export function hasPermission(permission: string): boolean {
  const user = getCurrentUser();
  if (permission === "inventar") return user.roles.includes("inventar") || user.roles.includes("admin");
  return true;
}
