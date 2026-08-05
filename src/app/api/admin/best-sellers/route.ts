import { NextRequest, NextResponse } from "next/server";
import BestSellersProduct from "@/models/BestSellersProduct";
import { connectDB } from "@/lib/mongodb";
import { fallbackBestSellers } from "@/data/fallbackCatalog";

export async function GET() {
  try {
    await connectDB();
    const products = await BestSellersProduct.find().sort({ order: 1 }).lean();
    return NextResponse.json(products.length ? products.map((p: any) => ({ ...p, _id: p._id.toString() })) : fallbackBestSellers);
  } catch {
    return NextResponse.json(fallbackBestSellers);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const created = await BestSellersProduct.create(body);
  const plain = { ...created.toObject(), _id: created._id.toString() };
  return NextResponse.json(plain, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { bestSellersProducts } = await req.json();
  if (!Array.isArray(bestSellersProducts)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  // Update order for each product in DB
  for (let i = 0; i < bestSellersProducts.length; i++) {
    const p = bestSellersProducts[i];
    await BestSellersProduct.findByIdAndUpdate(p._id, { order: i });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await BestSellersProduct.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
