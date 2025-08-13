import { NextRequest, NextResponse } from "next/server";
import Account from "@/models/Account";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "@/utils/sendEmail";

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

  // Check if email already exists
  const existing = await Account.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate activation token
  const activationToken = crypto.randomBytes(32).toString("hex");
  const activationTokenExpires = Date.now() + 1000 * 60 * 60 * 24;

  // Create account with isActive: false
  const account = await Account.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    country,
    deliveryAddress,
    isActive: false,
    activationToken,
    activationTokenExpires
  });

  // Send activation email
  const activationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/account/activate?token=${activationToken}`;
  await sendEmail(
    email,
    "Հաստատեք Ձեր հաշիվը, Activate your account, Подтвердите ваш аккаунт",
    `
    <p>Բարև, ${firstName}</p>
<p>Շնորհակալ ենք, որ գրանցվել եք Shokoladaran-ում։ Ձեր հաշիվը ակտիվացնելու համար, խնդրում ենք սեղմել ստորև գտնվող կոճակը կամ բացել հղումը դիտարկիչում։</p>
<p>Hello, ${firstName}</p>
<p>Thank you for signing up to Shokoladaran. To activate your account, please click the button below or open the link in your browser.</p>
<p>Здравствуйте, ${firstName}</p>
<p>Спасибо, что зарегистрировались на Shokoladaran. Чтобы активировать ваш аккаунт, нажмите на кнопку ниже или откройте ссылку в браузере.</p>
<p>🔗 Հաստատման հղում / Verification link / Ссылка для подтверждения: </p>
<p>${activationUrl}</p>
<p>Շնորհակալություն / Thank you / Спасибо
Shokoladaran թիմ / The Shokoladaran Team / Команда Shokoladaran
</p>
`
  );

  return NextResponse.json({ success: true, message: "Registration successful. Please check your email to activate your account." });
}