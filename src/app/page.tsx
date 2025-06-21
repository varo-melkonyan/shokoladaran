import SectionHero from "@/components/SectionHero";
import SectionGrid from "@/components/SectionGrid.client";
import bestSellers from "@/data/bestSellers.json";
import newProducts from "@/data/newsProducts.json";
import ExclusivesProduct from "@/models/ExclusivesProduct";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function getExclusivesProducts() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
  const products = await ExclusivesProduct.find().lean() as Array<{ [key: string]: any; _id: any }>;
  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  }));
}

async function fetchExclusivesProducts() {
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  let res = await fetch(`${baseUrl}/api/admin/exclusives-products`, { cache: "no-store" });
  if (!res.ok) {
    baseUrl = "http://localhost:3000";
    res = await fetch(`${baseUrl}/api/admin/exclusives-products`, { cache: "no-store" });
  }
  return res.json();
}

export default async function HomePage() {
  const exclusivesProducts = await fetchExclusivesProducts();
  return (
    <>
      <SectionHero />
      <SectionGrid title="Best Sellers" items={bestSellers} />
      <SectionGrid title="News" items={newProducts} />
      <SectionGrid title="Exclusives" items={exclusivesProducts} />
    </>
  );
}