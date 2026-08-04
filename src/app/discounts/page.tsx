import DiscountsClient from "./DiscountsClient";
import { getAllDiscountedProducts } from "@/lib/discounts";

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
  const discounted = (await getAllDiscountedProducts()).map(serializeProduct);
  return <DiscountsClient discounted={discounted} />;
}
