import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) return notFound();

  // Fetch recommendations (replace with your logic)
  const recommendations = [
    { _id: "1", name: "Choco Bar", image: product.image, price: 1200, discount: 900 },
    { _id: "2", name: "Sweet Box", image: product.image, price: 1500 },
    { _id: "3", name: "Dark Delight", image: product.image, price: 1800, discount: 1500 },
    { _id: "4", name: "Nutty Joy", image: product.image, price: 1100 },
  ];

  return (
    <ProductClient product={product} recommendations={recommendations} />
  );
}