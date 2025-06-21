// Handles GET and POST
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CollectionType from "@/models/CollectionType";

export async function GET() {
  await connectDB();
  const types = await CollectionType.find();
  return NextResponse.json(types);
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const newType = await CollectionType.create(body);
  return NextResponse.json(newType, { status: 201 });
}
