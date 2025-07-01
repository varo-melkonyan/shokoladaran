import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product"; // Use your Product model

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
}

// GET all gifts (products with collectionType: "Gift")
export async function GET() {
  await connectDB();
  const products = await Product.find({ collectionType: "Gift" }).sort({ order: 1 }).lean();
  const plainProducts = products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));
  return NextResponse.json(plainProducts);
}

// POST a new gift (ensure collectionType is "Gift")
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  // Force collectionType to "Gift"
  const created = await Product.create({ ...body, collectionType: "Gift" });
  const plain = { ...created.toObject(), _id: created._id.toString() };
  return NextResponse.json(plain, { status: 201 });
}

// PUT for reordering gifts (optional, if you use order)
export async function PUT(req: NextRequest) {
  await connectDB();
  const { gifts } = await req.json();
  if (!Array.isArray(gifts)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  for (let i = 0; i < gifts.length; i++) {
    const p = gifts[i];
    await Product.findByIdAndUpdate(p._id, { order: i });
  }
  return NextResponse.json({ success: true });
}

// DELETE a gift by id
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}