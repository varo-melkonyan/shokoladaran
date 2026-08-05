import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const [bestSellers, newsProducts, exclusivesProducts, ads] = await Promise.all([
    fetchCollection("/api/admin/best-sellers"),
    fetchCollection("/api/admin/news-products"),
    fetchCollection("/api/admin/exclusives-products"),
    fetchCollection("/api/admin/ads"),
  ]);

  const adsForNews = ads.filter((ad: any) => ad.place === "news");
  const adsForExclusives = ads.filter((ad: any) => ad.place === "exclusives");

  return (
    <HomePageClient
      bestSellers={bestSellers}
      newsProducts={newsProducts}
      exclusivesProducts={exclusivesProducts}
      adsForNews={adsForNews}
      adsForExclusives={adsForExclusives}
    />
  );
}

async function fetchCollection(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  try {
    if (!baseUrl) return [];
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    // Keep the storefront available during a temporary database outage.
    return [];
  }
}
