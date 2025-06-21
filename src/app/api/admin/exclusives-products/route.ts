import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExclusivesProduct from "@/models/ExclusivesProduct";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export async function GET() {
  await connectDB();
  const products = await ExclusivesProduct.find();
  return NextResponse.json(products);
}

// Add POST, PUT, DELETE as needed