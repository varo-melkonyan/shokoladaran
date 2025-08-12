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