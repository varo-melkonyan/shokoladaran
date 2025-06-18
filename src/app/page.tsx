import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import bestSellers from "@/data/bestSellers.json";
import newProducts from "@/data/newsProducts.json";
import exclusivesProducts from "@/data/exclusivesProducts.json";

export default function HomePage() {
  return (
    <>
      <SectionHero />
      <SectionGrid title="Best Sellers" items={bestSellers} />
      <SectionGrid title="News" items={newProducts} />
      <SectionGrid title="Exclusives" items={exclusivesProducts} />
    </>
  );
}