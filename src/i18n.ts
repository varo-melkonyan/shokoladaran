import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/data/locales/en.json";
import ru from "@/data/locales/ru.json";
import hy from "@/data/locales/hy.json";
import LanguageDetector from "i18next-browser-languagedetector";


i18n
  .use(initReactI18next)
  .use(LanguageDetector) 
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      hy: { translation: hy },
    },

    lng: "hy",
    fallbackLng: "hy",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;

export const locales = ["en", "hy", "ru"] as const;
export const defaultLocale = "hy";