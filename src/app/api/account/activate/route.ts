import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Invalid activation link." }, { status: 400 });
  }

  const account = await Account.findOne({ activationToken: token, activationTokenExpires: { $gt: Date.now() } });
  if (!account) {
    return NextResponse.json({ error: "Activation link is invalid or expired." }, { status: 400 });
  }

  account.isActive = true;
  account.activationToken = undefined;
  account.activationTokenExpires = undefined;
  await account.save();

  return NextResponse.json({ success: true, message: "Account activated successfully. You can now log in." });
}