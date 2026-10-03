import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import ru from "../locales/ru.json";
import az from "../locales/az.json";

export const SUPPORTED_LOCALES = ["en", "ru", "az"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const STORAGE_KEY = "app_language";

function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function detectLocale(): AppLocale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && isAppLocale(stored)) {
    return stored;
  }

  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("ru")) return "ru";
  if (browserLang.startsWith("az")) return "az";
  return "en";
}

const initialLocale = detectLocale();
document.documentElement.lang = initialLocale;

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    az: { translation: az },
  },
  lng: initialLocale,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export function setAppLanguage(locale: AppLocale) {
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
  return i18n.changeLanguage(locale);
}

export default i18n;
