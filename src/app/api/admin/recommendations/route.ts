import { NextRequest, NextResponse } from "next/server";
import { getRecommendations, setRecommendations } from "@/lib/recommendations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }
  const rec = await getRecommendations(productId);
  return NextResponse.json(rec || { recommendedByCollection: {} });
}

export async function POST(req: NextRequest) {
  const { productId, recommendedByCollection } = await req.json();
  if (
    !productId ||
    typeof recommendedByCollection !== "object" ||
    Array.isArray(recommendedByCollection)
  ) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await setRecommendations(productId, recommendedByCollection);
  return NextResponse.json({ ok: true });
}