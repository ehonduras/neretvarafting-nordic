/** Build a locale-prefixed path for use with next/link. Zero client JS. */
export function lp(locale: string, path: string): string {
  if (path === "/") return `/${locale}`;
  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
