// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/data/locales/en.json";
import ru from "@/data/locales/ru.json";
import hy from "@/data/locales/hy.json";

const getInitialLanguage = () => {
  if (typeof window !== "undefined") {
    const savedLng = localStorage.getItem("lng");
    if (savedLng) return savedLng;
  }
  return "hy";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      hy: { translation: hy },
    },
    lng: getInitialLanguage(),
    fallbackLng: "hy",
    interpolation: { escapeValue: false },
  });

export default i18n;

export const locales = ['en', 'hy', 'ru'] as const;
export const defaultLocale = 'hy';
