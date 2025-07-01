import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Specials from "@/models/Specials";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
}

// GET all specials
export async function GET() {
  await connectDB();
  const specials = await Specials.find().sort({ order: 1 }).lean();
  const plainSpecials = specials.map((g: any) => ({
    ...g,
    _id: g._id.toString(),
  }));
  return NextResponse.json(plainSpecials);
}

// POST a new special
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  // Validate required fields
  if (!body.name || !body.price || !body.weight || !body.brand || !body.collectionType || !body.status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const createdSpecial = await Specials.create(body);
  return NextResponse.json(createdSpecial, { status: 201 });
}

// PUT for reordering specials (optional, if you use order)
export async function PUT(req: NextRequest) {
  await connectDB();
  const { specials } = await req.json();
  if (!Array.isArray(specials)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  for (let i = 0; i < specials.length; i++) {
    const g = specials[i];
    await Specials.findByIdAndUpdate(g._id, { order: i });
  }
  return NextResponse.json({ success: true });
}

// DELETE a special by id
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await Specials.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}