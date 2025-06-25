import DiscountsClient from "./DiscountsClient";
import { getAllDiscountedProducts } from "@/lib/discounts";

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
