import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "No id" }, { status: 400 });
  const account = await Account.findById(id).select("firstName lastName phoneNumber deliveryAddress");
  if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ account });
}