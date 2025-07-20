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
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const { ObjectId } = await import("mongodb");

  if ("_id" in body) delete body._id;

  try {
    await db.collection("ads").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body } }
    );
    const updatedAd = await db.collection("ads").findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedAd);
  } catch (err) {
    return NextResponse.json({ error: "Invalid id or update failed" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const { ObjectId } = await import("mongodb");

  try {
    await db.collection("ads").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid id or delete failed" }, { status: 400 });
  }
}