export function formatCheckIn(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function isDueSoon(iso?: string): boolean {
  const days = daysUntil(iso);
  if (days === null) return false;
  return days <= 7;
}

export function isDueOrSoon(iso?: string): boolean {
  const days = daysUntil(iso);
  if (days === null) return false;
  return days <= 7;
}
