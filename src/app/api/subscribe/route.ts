import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/clientPromise";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Save email to MongoDB
    const client = await clientPromise;
    const db = client.db(); // Use default DB from URI
    const collection = db.collection("newsletter_subscribers");

    // Optional: prevent duplicate subscriptions
    const exists = await collection.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "Email already subscribed" }, { status: 409 });
    }

    await collection.insertOne({ email, subscribedAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}