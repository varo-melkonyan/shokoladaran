import DiscountsClient from "./DiscountsClient";
import { getAllDiscountedProducts } from "@/lib/discounts";
import { fallbackProducts } from "@/data/fallbackCatalog";

// Discounts come from MongoDB and must be loaded at request time. Prerendering
// this page would make production builds depend on database availability.
export const dynamic = "force-dynamic";

function serializeProduct(product) {
  return {
    ...product,
    _id: product._id?.toString?.() ?? product._id,
  };
}

export default async function DiscountsPage() {
  let discounted: any[] = fallbackProducts
    .filter((product) => "discount" in product && product.discount)
    .map(serializeProduct);

  try {
    const databaseProducts = (await getAllDiscountedProducts()).map(serializeProduct);
    if (databaseProducts.length) discounted = databaseProducts;
  } catch {
    // Render the page without products while MongoDB is temporarily unavailable.
  }

  return <DiscountsClient discounted={discounted} />;
}
