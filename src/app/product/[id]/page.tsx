import { notFound } from "next/navigation";
import { getProductById, getProductsByIds } from "@/lib/products";
import { getRecommendations } from "@/lib/recommendations";
import ProductClient from "./ProductClient";

export default async function ProductPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return notFound();

  let recommendations: Awaited<ReturnType<typeof getProductsByIds>> = [];
  if (product.collectionType) {
    const recDoc = await getRecommendations(product.collectionType);
    const recommendedIds: string[] = recDoc?.recommendedByCollection?.[product.collectionType] || [];
    recommendations = recommendedIds.length
      ? await getProductsByIds(recommendedIds.filter(id => id !== product._id))
      : [];
  }

  return <ProductClient product={product} recommendations={recommendations} />;
}
