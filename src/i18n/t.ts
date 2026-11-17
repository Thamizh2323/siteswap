import en from "./en.json";
import ta from "./ta.json";
import { getClientLocale, Locale } from "./locale";

type TranslationDict = Record<string, unknown>;

const dictionaries: Record<Locale, TranslationDict> = {
  en: en as TranslationDict,
  ta: ta as TranslationDict,
};

function getNestedValue(obj: TranslationDict, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;

  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

export function t(key: string, locale?: Locale): string {
  const activeLocale = locale || getClientLocale();
  const dict = dictionaries[activeLocale] || dictionaries.en;
  const value = getNestedValue(dict, key);

  if (value !== undefined) return value;

  // Fallback to English if missing in target locale
  if (activeLocale !== "en") {
    const fallback = getNestedValue(dictionaries.en, key);
    if (fallback !== undefined) return fallback;
  }

  return key;
}
