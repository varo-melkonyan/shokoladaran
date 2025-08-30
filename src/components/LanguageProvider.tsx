"use client";
import { useEffect, useState } from "react";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLng = localStorage.getItem("lng");
    if (savedLng && i18n.language !== savedLng) {
      i18n.changeLanguage(savedLng);
    }
  }, [i18n]);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}