import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";

export async function GET() {
  const accounts = await Account.find();
  return NextResponse.json(accounts);
}