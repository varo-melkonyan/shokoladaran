"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SectionHero() {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { t } = useTranslation();
  

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
    }
  }

  return (
    <section
      className="w-full min-h-[500px] py-12 flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/hero.png')" }}
    >
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center text-white drop-shadow">
        {t("home_banner_big")}
      </h1>
      <p className="text-base md:text-lg text-gray-100 mb-6 text-center max-w-xl drop-shadow">
        {t("home_banner_small")}
      </p>
    </section>
  );
}