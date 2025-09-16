const STORAGE_KEYS = {
  auth: "tm_auth",
  projects: "tm_projects",
  tasks: "tm_tasks",
};

export function saveToStorage<T>(key: keyof typeof STORAGE_KEYS, data: T): void {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

export function loadFromStorage<T>(key: keyof typeof STORAGE_KEYS, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function clearStorage(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}
