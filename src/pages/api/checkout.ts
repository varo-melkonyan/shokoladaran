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