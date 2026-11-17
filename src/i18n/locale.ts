export type Locale = "en" | "ta";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "siteswap_locale";

export function getClientLocale(): Locale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`(^| )${LOCALE_COOKIE}=([^;]+)`));
  const val = match?.[2];
  return val === "ta" ? "ta" : DEFAULT_LOCALE;
}

export function setClientLocale(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
