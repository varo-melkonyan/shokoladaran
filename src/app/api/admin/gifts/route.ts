import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Gifts from "@/models/Gifts";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
}

// GET all gifts
export async function GET() {
  await connectDB();
  const gifts = await Gifts.find().sort({ order: 1 }).lean();
  const plainGifts = gifts.map((g: any) => ({
    ...g,
    _id: g._id.toString(),
  }));
  return NextResponse.json(plainGifts);
}

// POST a new gift
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.price || !body.weight || !body.brand || !body.collectionType || !body.status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const createdGift = await Gifts.create(body);
  return NextResponse.json(createdGift, { status: 201 });
}

// PUT for reordering gifts (optional, if you use order)
export async function PUT(req: NextRequest) {
  await connectDB();
  const { gifts } = await req.json();
  if (!Array.isArray(gifts)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  for (let i = 0; i < gifts.length; i++) {
    const g = gifts[i];
    await Gifts.findByIdAndUpdate(g._id, { order: i });
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
  await Gifts.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}