// app/api/admin/upload/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Add random suffix to avoid duplicate filenames
  const blob = await put(file.name, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
    addRandomSuffix: true, // <-- Add this option
  });

  return NextResponse.json({ url: blob.url });
}
