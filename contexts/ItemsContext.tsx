import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ACTIVE_SEED_ITEMS,
  CATEGORIES,
  CustomCategory,
  ParkedItem,
  SEED_ITEMS,
} from "@/constants/parked";
import { categoryColor, randomSoftColor } from "@/lib/categoryColors";
import { STORAGE_KEYS, newId, readJSON, writeJSON } from "@/lib/storage";

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

type ItemsContextValue = {
  items: ParkedItem[];
  parkedItems: ParkedItem[];
  activeItems: ParkedItem[];
  deletedItems: ParkedItem[];
  customCategories: CustomCategory[];
  hydrated: boolean;
  addItem: (
    input: Omit<ParkedItem, "id" | "createdAt"> & { id?: string },
  ) => Promise<ParkedItem>;
  updateItem: (id: string, patch: Partial<ParkedItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  restoreItem: (id: string) => Promise<void>;
  permanentDeleteItem: (id: string) => Promise<void>;
  unparkItem: (id: string) => Promise<void>;
  parkAgain: (id: string, patch: Partial<ParkedItem>) => Promise<void>;
  snoozeItem: (id: string, days?: number) => Promise<void>;
  getItem: (id: string) => ParkedItem | undefined;
  addCustomCategory: (name: string) => Promise<CustomCategory | null>;
  colorFor: (categoryName?: string) => string;
};

const ItemsContext = createContext<ItemsContextValue | undefined>(undefined);

function purgeExpired(items: ParkedItem[]): ParkedItem[] {
  const now = Date.now();
  return items.filter((it) => {
    if (!it.deletedAt) return true;
    const t = new Date(it.deletedAt).getTime();
    if (Number.isNaN(t)) return true;
    return now - t < SEVEN_DAYS;
  });
}

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ParkedItem[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const seeded = await readJSON<boolean>(STORAGE_KEYS.seeded, false);
      const stored = await readJSON<ParkedItem[]>(STORAGE_KEYS.items, []);
      const customs = await readJSON<CustomCategory[]>(
        STORAGE_KEYS.customCategories,
        [],
      );

      let initial = stored;
      if (!seeded && stored.length === 0) {
        initial = [...SEED_ITEMS, ...ACTIVE_SEED_ITEMS];
        await writeJSON(STORAGE_KEYS.items, initial);
        await writeJSON(STORAGE_KEYS.seeded, true);
      } else {
        // One-time migration: drop in the active examples for users who
        // seeded before the Active page existed.
        const hasActiveSeed = initial.some((i) => i.id.startsWith("active-"));
        if (!hasActiveSeed) {
          initial = [...initial, ...ACTIVE_SEED_ITEMS];
          await writeJSON(STORAGE_KEYS.items, initial);
        }
      }

      const purged = purgeExpired(initial);
      if (purged.length !== initial.length) {
        await writeJSON(STORAGE_KEYS.items, purged);
      }

      setItems(purged);
      setCustomCategories(customs);
      setHydrated(true);
    })();
  }, []);

  const persistItems = useCallback(async (next: ParkedItem[]) => {
    setItems(next);
    await writeJSON(STORAGE_KEYS.items, next);
  }, []);

  const persistCustom = useCallback(async (next: CustomCategory[]) => {
    setCustomCategories(next);
    await writeJSON(STORAGE_KEYS.customCategories, next);
  }, []);

  const addItem = useCallback<ItemsContextValue["addItem"]>(
    async (input) => {
      const created: ParkedItem = {
        id: input.id ?? newId(),
        title: input.title,
        notes: input.notes,
        type: input.type,
        category: input.category,
        energy: input.energy,
        checkInDate: input.checkInDate,
        createdAt: new Date().toISOString(),
      };
      await persistItems([created, ...items]);
      return created;
    },
    [items, persistItems],
  );

  const updateItem = useCallback<ItemsContextValue["updateItem"]>(
    async (id, patch) => {
      const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
      await persistItems(next);
    },
    [items, persistItems],
  );

  const deleteItem = useCallback<ItemsContextValue["deleteItem"]>(
    async (id) => {
      const next = items.map((it) =>
        it.id === id
          ? { ...it, deletedAt: new Date().toISOString() }
          : it,
      );
      await persistItems(next);
    },
    [items, persistItems],
  );

  const restoreItem = useCallback<ItemsContextValue["restoreItem"]>(
    async (id) => {
      const next = items.map((it) =>
        it.id === id
          ? { ...it, deletedAt: undefined, unparkedAt: undefined }
          : it,
      );
      await persistItems(next);
    },
    [items, persistItems],
  );

  const permanentDeleteItem = useCallback<
    ItemsContextValue["permanentDeleteItem"]
  >(
    async (id) => {
      const next = items.filter((it) => it.id !== id);
      await persistItems(next);
    },
    [items, persistItems],
  );

  const unparkItem = useCallback<ItemsContextValue["unparkItem"]>(
    async (id) => {
      const next = items.map((it) =>
        it.id === id
          ? { ...it, unparkedAt: new Date().toISOString(), deletedAt: undefined }
          : it,
      );
      await persistItems(next);
    },
    [items, persistItems],
  );

  const parkAgain = useCallback<ItemsContextValue["parkAgain"]>(
    async (id, patch) => {
      const next = items.map((it) =>
        it.id === id
          ? { ...it, ...patch, unparkedAt: undefined, deletedAt: undefined }
          : it,
      );
      await persistItems(next);
    },
    [items, persistItems],
  );

  const snoozeItem = useCallback<ItemsContextValue["snoozeItem"]>(
    async (id, days = 14) => {
      const next = items.map((it) => {
        if (it.id !== id) return it;
        const base = new Date();
        base.setDate(base.getDate() + days);
        return { ...it, checkInDate: base.toISOString().slice(0, 10) };
      });
      await persistItems(next);
    },
    [items, persistItems],
  );

  const getItem = useCallback(
    (id: string) => items.find((it) => it.id === id),
    [items],
  );

  const addCustomCategory = useCallback<
    ItemsContextValue["addCustomCategory"]
  >(
    async (name) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const lower = trimmed.toLowerCase();
      if (CATEGORIES.some((c) => c.toLowerCase() === lower)) return null;
      const existing = customCategories.find(
        (c) => c.name.toLowerCase() === lower,
      );
      if (existing) return existing;
      const used = customCategories.map((c) => c.color);
      const created: CustomCategory = {
        name: trimmed,
        color: randomSoftColor(used),
      };
      await persistCustom([...customCategories, created]);
      return created;
    },
    [customCategories, persistCustom],
  );

  const colorFor = useCallback(
    (name?: string) => categoryColor(name, customCategories),
    [customCategories],
  );

  const parkedItems = useMemo(
    () => items.filter((i) => !i.unparkedAt && !i.deletedAt),
    [items],
  );
  const activeItems = useMemo(
    () => items.filter((i) => !!i.unparkedAt && !i.deletedAt),
    [items],
  );
  const deletedItems = useMemo(
    () => items.filter((i) => !!i.deletedAt),
    [items],
  );

  const value = useMemo<ItemsContextValue>(
    () => ({
      items,
      parkedItems,
      activeItems,
      deletedItems,
      customCategories,
      hydrated,
      addItem,
      updateItem,
      deleteItem,
      restoreItem,
      permanentDeleteItem,
      unparkItem,
      parkAgain,
      snoozeItem,
      getItem,
      addCustomCategory,
      colorFor,
    }),
    [
      items,
      parkedItems,
      activeItems,
      deletedItems,
      customCategories,
      hydrated,
      addItem,
      updateItem,
      deleteItem,
      restoreItem,
      permanentDeleteItem,
      unparkItem,
      parkAgain,
      snoozeItem,
      getItem,
      addCustomCategory,
      colorFor,
    ],
  );

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const ctx = useContext(ItemsContext);
  if (!ctx) throw new Error("useItems must be used inside ItemsProvider");
  return ctx;
}
