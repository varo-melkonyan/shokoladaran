// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const brand = formData.get("brand")?.toString().toLowerCase().replace(/\s+/g, "_") || "unknown";
  const collectionType = formData.get("collectionType")?.toString().toLowerCase().replace(/\s+/g, "_") || "default";

  const blob = await put(`${brand}_${collectionType}_${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
