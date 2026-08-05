// Handles GET and POST
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CollectionType from "@/models/CollectionType";
import { fallbackCollectionTypes } from "@/data/fallbackCatalog";

export async function GET() {
  try {
    await connectDB();
    const types = await CollectionType.find();
    return NextResponse.json(types.length ? types : fallbackCollectionTypes);
  } catch {
    return NextResponse.json(fallbackCollectionTypes);
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const newType = await CollectionType.create(body);
  return NextResponse.json(newType, { status: 201 });
}
