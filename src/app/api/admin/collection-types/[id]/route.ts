import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import CollectionType from "@/models/CollectionType";

export async function DELETE(
  request: NextRequest,
  { params }: any
) {
  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await connectDB();

  try {
    await CollectionType.findByIdAndDelete(id);
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}