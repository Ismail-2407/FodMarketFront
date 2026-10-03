import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import {
  AppLocale,
  SUPPORTED_LOCALES,
  setAppLanguage,
} from "../i18n";
import "./LanguageSwitcher.css";

const LOCALE_LABEL_KEYS = {
  en: "language.en",
  ru: "language.ru",
  az: "language.az",
} as const satisfies Record<AppLocale, "language.en" | "language.ru" | "language.az">;

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language as AppLocale;

  const handleChange = (locale: AppLocale) => {
    if (locale === currentLocale) return;
    void setAppLanguage(locale);
  };

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("language.switchLabel")}
    >
      <FaGlobe className="language-switcher__icon" aria-hidden="true" />
      <div className="language-switcher__options">
        {SUPPORTED_LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            className={`language-switcher__option${
              currentLocale === locale ? " language-switcher__option--active" : ""
            }`}
            onClick={() => handleChange(locale)}
            aria-pressed={currentLocale === locale}
            aria-label={t("language.switchLabel") + ": " + t(LOCALE_LABEL_KEYS[locale])}
          >
            {t(LOCALE_LABEL_KEYS[locale])}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
