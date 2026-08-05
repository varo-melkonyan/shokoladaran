import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import HomePageClient from "@/components/HomePageClient";
import {
  fallbackBestSellers,
  fallbackExclusivesProducts,
  fallbackNewsProducts,
} from "@/data/fallbackCatalog";

export default async function HomePage() {
  const [bestSellers, newsProducts, exclusivesProducts, ads] = await Promise.all([
    fetchCollection("/api/admin/best-sellers", fallbackBestSellers),
    fetchCollection("/api/admin/news-products", fallbackNewsProducts),
    fetchCollection("/api/admin/exclusives-products", fallbackExclusivesProducts),
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

async function fetchCollection(path: string, fallback: readonly any[] = []) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  try {
    if (!baseUrl) return [...fallback];
    const res = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return [...fallback];
    const data = await res.json();
    return Array.isArray(data) && data.length ? data : [...fallback];
  } catch {
    // Keep the storefront available during a temporary database outage.
    return [...fallback];
  }
}
