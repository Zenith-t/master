export type KeySelector<T> = (item: T) => string | number | null | undefined;

export function normalize(s: unknown): string {
  return (s ?? "").toString().toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "");
}

export function useSmartFilter<T>(items: T[] = [], query: string, keys?: Array<keyof T | KeySelector<T>>): T[] {
  if (!query) return items;
  const q = normalize(query);
  const pickers: KeySelector<T>[] = (keys && keys.length ? keys : [((x: T) => JSON.stringify(x))]).map((k) => {
    if (typeof k === "function") return k;
    return (x: T) => (x as any)?.[k];
  });

  return items.filter((item) => pickers.some((pick) => normalize(pick(item)).includes(q)));
}
