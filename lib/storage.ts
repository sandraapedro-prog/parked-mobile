import AsyncStorage from "@react-native-async-storage/async-storage";

export async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const STORAGE_KEYS = {
  items: "parked.items.v1",
  user: "parked.user.v1",
  users: "parked.users.v1",
  seeded: "parked.seeded.v1",
  customCategories: "parked.customCategories.v1",
};

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}
