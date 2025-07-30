import GiftClient from "./GiftClient";

export default async function GiftPage({ params }: { params: { id: string } }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/gifts/${params.id}`);
  if (!res.ok) return <div>Gift not found.</div>;
  const gift = await res.json();

  return <GiftClient gift={gift} />;
}