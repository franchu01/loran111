export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getUserInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function parseOrderedItems(items: string): string[] {
  try {
    const parsed = JSON.parse(items);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return items.split(",").map((i) => i.trim()).filter(Boolean);
}

export function stringifyOrderedItems(items: string[]): string {
  return JSON.stringify(items);
}
