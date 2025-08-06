import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import CollectionType from "@/models/CollectionType";


export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await req.json();

  await connectDB();

  const updated = await CollectionType.findByIdAndUpdate(
    id,
    {
      name_en: body.name_en,
      name_hy: body.name_hy,
      name_ru: body.name_ru,
      type: body.type,
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, id, ...body });
}

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