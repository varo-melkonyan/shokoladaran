import { NextRequest, NextResponse } from "next/server";
import NewsProduct from "@/models/NewsProduct";
import { connectDB } from "@/lib/mongodb";
import { fallbackNewsProducts } from "@/data/fallbackCatalog";

export async function GET() {
  try {
    await connectDB();
    const products = await NewsProduct.find().sort({ order: 1 }).lean();
    return NextResponse.json(products.length ? products.map((p: any) => ({ ...p, _id: p._id.toString() })) : fallbackNewsProducts);
  } catch {
    return NextResponse.json(fallbackNewsProducts);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const created = await NewsProduct.create(body);
  const plain = { ...created.toObject(), _id: created._id.toString() };
  return NextResponse.json(plain, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { newsProducts } = await req.json(); // <-- camelCase
  if (!Array.isArray(newsProducts)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  for (let i = 0; i < newsProducts.length; i++) {
    const p = newsProducts[i];
    await NewsProduct.findByIdAndUpdate(p._id, { order: i });
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
  await NewsProduct.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
