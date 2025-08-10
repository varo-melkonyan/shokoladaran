import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";

export async function POST(req: NextRequest) {
  const { accountId, firstName, lastName, email, phoneNumber, deliveryAddress, country } = await req.json();
  if (!accountId || !firstName || !lastName || !email || !deliveryAddress || !country) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await Account.findByIdAndUpdate(accountId, {
    firstName,
    lastName,
    email,
    phoneNumber,
    deliveryAddress,
    country,
  });
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { accountId } = Object.fromEntries(req.nextUrl.searchParams);
  if (!accountId) {
    return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
  }
  const account = await Account.findById(accountId);
  return NextResponse.json({ account });
}