import { notFound } from "next/navigation";
import { getGiftsById } from "@/lib/gifts";
import GiftClient from "./GiftClient";

export default async function GiftPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const gift = await getGiftsById(id);
  if (!gift) return notFound();

 return <GiftClient gift={gift} />;
}
