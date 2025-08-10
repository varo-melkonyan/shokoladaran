import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    country,
    deliveryAddress,
  } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const account = await Account.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    country,
    deliveryAddress,
  });

  return NextResponse.json({ success: true, account });
}