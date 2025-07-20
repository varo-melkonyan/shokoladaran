import { NextResponse } from "next/server";
import clientPromise from "@/lib/clientPromise";

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const ads = await db.collection("ads").find({}).toArray();
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const result = await db.collection("ads").insertOne({
    images: body.images || [],
    place: body.place || "news",
    link: body.link || ""
  });
  const newAd = await db.collection("ads").findOne({ _id: result.insertedId });
  return NextResponse.json(newAd, { status: 201 });
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const { ObjectId } = require("mongodb");
  await db.collection("ads").updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...body } }
  );
  const updatedAd = await db.collection("ads").findOne({ _id: new ObjectId(id) });
  return NextResponse.json(updatedAd);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const client = await clientPromise;
  const db = client.db();
  const { ObjectId } = require("mongodb");
  await db.collection("ads").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ success: true });
}