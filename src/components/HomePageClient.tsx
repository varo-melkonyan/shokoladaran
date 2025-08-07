"use client";
import { useTranslation } from "react-i18next";
import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import NewsletterSection from "./NewsletterSection";
import WelcomeSection from "./WelcomeSection";

export default function HomePageClient({ bestSellers, newsProducts, exclusivesProducts, adsForNews, adsForExclusives }: any) {
  const { t } = useTranslation();

  return (
    <>
      <SectionHero />
      <WelcomeSection />
      <SectionGrid title={t("best_sellers")} items={bestSellers} />
      <SectionGrid title={t("news")} items={newsProducts} ads={adsForNews} />
      <SectionGrid title={t("exclusives")} items={exclusivesProducts} ads={adsForExclusives} />
      <NewsletterSection />
    </>
  );
}