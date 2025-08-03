import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const bestSellers = await fetchBestSellersProducts();
  const newsProducts = await fetchNewsProducts();
  const exclusivesProducts = await fetchExclusivesProducts();
  const ads = await fetchAds();

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

async function fetchExclusivesProducts() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let res;
  try {
    res = await fetch(`${baseUrl}/api/admin/exclusives-products`, { cache: "no-store" });
    if (!res.ok) throw new Error();
  } catch {
    baseUrl = "http://localhost:3000";
    res = await fetch(`${baseUrl}/api/admin/exclusives-products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch exclusives products");
  }
  return res.json();
}

async function fetchBestSellersProducts() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let res;
  try {
    res = await fetch(`${baseUrl}/api/admin/best-sellers`, { cache: "no-store" });
    if (!res.ok) throw new Error();
  } catch {
    baseUrl = "http://localhost:3000";
    res = await fetch(`${baseUrl}/api/admin/best-sellers`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch best sellers products");
  }
  return res.json();
}

async function fetchNewsProducts() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let res;
  try {
    res = await fetch(`${baseUrl}/api/admin/news-products`, { cache: "no-store" });
    if (!res.ok) throw new Error();
  } catch {
    baseUrl = "http://localhost:3000";
    res = await fetch(`${baseUrl}/api/admin/news-products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch news products");
  }
  return res.json();
}

async function fetchAds() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let res;
  try {
    res = await fetch(`${baseUrl}/api/admin/ads`, { cache: "no-store" });
    if (!res.ok) throw new Error();
  } catch {
    baseUrl = "http://localhost:3000";
    res = await fetch(`${baseUrl}/api/admin/ads`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch ads");
  }
  return res.json();
}