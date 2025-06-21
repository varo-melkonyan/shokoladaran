import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const products = await Product.find();
    return res.status(200).json(products);
  }

  if (req.method === "POST") {
    try {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create product" });
    }
  }

  res.status(405).end();
}