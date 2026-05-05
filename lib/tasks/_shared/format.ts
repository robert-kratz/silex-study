export const numberFormat = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 2,
});

export const numberFormat4 = new Intl.NumberFormat("de-DE", {
  maximumFractionDigits: 4,
});

export const currencyFormat = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export const fmt = (n: number): string => numberFormat.format(n);
export const fmt4 = (n: number): string => numberFormat4.format(n);
export const eur = (n: number): string => currencyFormat.format(n);
export const pct = (n: number): string => `${numberFormat.format(n * 100)} %`;

/**
 * Parse a German-locale decimal string ("1.234,56" / "1234,56" / "12.5") to a number.
 * Returns null on empty input, NaN on invalid input.
 */
export function parseLocaleNumber(raw: string): number | null {
  const cleaned = raw
    .trim()
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  if (cleaned === "") return null;
  const v = Number(cleaned);
  return Number.isFinite(v) ? v : Number.NaN;
}
