import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json({ error: "Email/Phone and password required." }, { status: 400 });
  }

  // Find by email or phoneNumber
  const account = await Account.findOne({ email: identifier });
  if (!account) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  if (!account.isActive) {
    return NextResponse.json({ error: "Account not activated. Please check your email." }, { status: 403 });
  }

  const isMatch = await bcrypt.compare(password, account.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  // Return account data (omit password)
  const { password: _, ...accountData } = account.toObject();
  return NextResponse.json({ account: accountData });
}