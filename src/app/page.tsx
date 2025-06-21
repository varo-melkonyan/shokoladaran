import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import bestSellers from "@/data/bestSellers.json";
import newProducts from "@/data/newsProducts.json";

// async function fetchExclusivesProducts() {
//   let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   let res;
//   try {
//     res = await fetch(`${baseUrl}/api/admin/exclusives-products`, { cache: "no-store" });
//     if (!res.ok) throw new Error();
//   } catch {
//     baseUrl = "http://localhost:3000";
//     res = await fetch(`${baseUrl}/api/admin/exclusives-products`, { cache: "no-store" });
//     if (!res.ok) throw new Error("Failed to fetch exclusives products");
//   }
//   return res.json();
// }

export default async function HomePage() {
  // const exclusivesProducts = await fetchExclusivesProducts();
  return (
    <>
      <SectionHero />
      <SectionGrid title="Best Sellers" items={bestSellers} />
      <SectionGrid title="News" items={newProducts} />
      {/* <SectionGrid title="Exclusives" items={exclusivesProducts} /> */}
    </>
  );
}