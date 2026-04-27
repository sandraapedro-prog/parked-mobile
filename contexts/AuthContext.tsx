import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { STORAGE_KEYS, readJSON, remove, writeJSON } from "@/lib/storage";

type User = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = User & { password: string };

type AuthContextValue = {
  user: User | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await readJSON<User | null>(STORAGE_KEYS.user, null);
      setUser(stored);
      setHydrated(true);
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      throw new Error("Please enter your email and password.");
    }
    const users = await readJSON<StoredUser[]>(STORAGE_KEYS.users, []);
    const match = users.find((u) => u.email.toLowerCase() === trimmed);
    if (!match) {
      // Soft account creation on first sign-in for a calmer demo flow.
      const created: StoredUser = {
        id: Date.now().toString(36),
        name: trimmed.split("@")[0] ?? "Friend",
        email: trimmed,
        password,
      };
      await writeJSON(STORAGE_KEYS.users, [...users, created]);
      const safe: User = { id: created.id, name: created.name, email: created.email };
      await writeJSON(STORAGE_KEYS.user, safe);
      setUser(safe);
      return;
    }
    if (match.password !== password) {
      throw new Error("That password doesn't match.");
    }
    const safe: User = { id: match.id, name: match.name, email: match.email };
    await writeJSON(STORAGE_KEYS.user, safe);
    setUser(safe);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = name.trim();
      if (!trimmedName || !trimmedEmail || !password) {
        throw new Error("Please fill in all fields.");
      }
      if (password.length < 4) {
        throw new Error("Use at least 4 characters for your password.");
      }
      const users = await readJSON<StoredUser[]>(STORAGE_KEYS.users, []);
      if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        throw new Error("An account with that email already exists.");
      }
      const created: StoredUser = {
        id: Date.now().toString(36),
        name: trimmedName,
        email: trimmedEmail,
        password,
      };
      await writeJSON(STORAGE_KEYS.users, [...users, created]);
      const safe: User = { id: created.id, name: created.name, email: created.email };
      await writeJSON(STORAGE_KEYS.user, safe);
      setUser(safe);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await remove(STORAGE_KEYS.user);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, signIn, register, signOut }),
    [user, hydrated, signIn, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
