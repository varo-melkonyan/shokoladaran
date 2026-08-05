import { NextRequest, NextResponse } from "next/server";
import ExclusivesProduct from "@/models/ExclusivesProduct";
import { connectDB } from "@/lib/mongodb";
import { fallbackExclusivesProducts } from "@/data/fallbackCatalog";

export async function GET() {
  try {
    await connectDB();
    const products = await ExclusivesProduct.find().sort({ order: 1 }).lean();
    return NextResponse.json(products.length ? products.map((p: any) => ({ ...p, _id: p._id.toString() })) : fallbackExclusivesProducts);
  } catch {
    return NextResponse.json(fallbackExclusivesProducts);
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const created = await ExclusivesProduct.create(body);
  const plain = { ...created.toObject(), _id: created._id.toString() };
  return NextResponse.json(plain, { status: 201 });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { exclusivesProducts } = await req.json();
  if (!Array.isArray(exclusivesProducts)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  // Update order for each product in DB
  for (let i = 0; i < exclusivesProducts.length; i++) {
    const p = exclusivesProducts[i];
    await ExclusivesProduct.findByIdAndUpdate(p._id, { order: i });
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
  await ExclusivesProduct.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
