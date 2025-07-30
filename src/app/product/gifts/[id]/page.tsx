import ProductClient from "@/app/product/[id]/ProductClient";

export default async function GiftProductPage({ params }: { params: { id: string } }) {
  // Fetch the gift by ID from your API
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/gifts/${params.id}`);
  if (!res.ok) return <div>Gift not found.</div>;
  const product = await res.json();

  // You can fetch recommendations if needed
  const recommendations: any[] = [];

  return (
    <ProductClient product={product} recommendations={recommendations} type="gifts" />
  );
}