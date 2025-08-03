"use client";
import { useEffect } from "react";
import i18n from "@/i18n";

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const savedLng = localStorage.getItem("lng");
    if (savedLng && i18n.language !== savedLng) {
      i18n.changeLanguage(savedLng);
    }
  }, []);

  return <>{children}</>;
}