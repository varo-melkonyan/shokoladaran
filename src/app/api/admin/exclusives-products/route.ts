import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExclusivesProduct from "@/models/ExclusivesProduct";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET() {
  await connectDB();
  const products = await ExclusivesProduct.find().lean();
  // Convert _id to string for client compatibility
  const plainProducts = products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));
  return NextResponse.json(plainProducts);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const created = await ExclusivesProduct.create(body);
  // Convert _id to string for client compatibility
  const plain = { ...created.toObject(), _id: created._id.toString() };
  return NextResponse.json(plain, { status: 201 });
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