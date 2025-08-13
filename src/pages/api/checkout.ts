import type { NextApiRequest, NextApiResponse } from "next";
import Account from "@/models/Account";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { cart, form, deliveryType, accountId } = req.body;

  const order = {
    id: Math.floor(Math.random() * 1000000),
    cart,
    form,
    deliveryType,
    status: "created",
    createdAt: new Date().toISOString(),
  };

  if (accountId) {
    await Account.findByIdAndUpdate(accountId, {
      $push: { orders: order }
    });
  }

  return res.status(200).json({
    success: true,
    order,
    url: "/cart?success=1",
    message: "Test checkout successful!",
  });
}


// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-04-10",
// });

// export async function POST(req: NextRequest) {
//   const { cart, form, deliveryType } = await req.json();

//   const line_items = cart.map((item: any) => ({
//     price_data: {
//       currency: "amd",
//       product_data: {
//         name: item.title,
//         images: item.image ? [item.image] : [],
//       },
//       unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
//     },
//     quantity: item.quantity,
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items,
//     mode: "payment",
//     success_url: process.env.NEXT_PUBLIC_BASE_URL + "/cart?success=1",
//     cancel_url: process.env.NEXT_PUBLIC_BASE_URL + "/cart?canceled=1",
//     customer_email: form.email,
//     metadata: {
//       deliveryType,
//       address: form.address || "",
//       name: form.name,
//       phone: form.phone,
//     },
//   });

//   return NextResponse.json({ url: session.url });
// }