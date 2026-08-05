import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { fallbackProducts } from "@/data/fallbackCatalog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const products = await Product.find();
      return res.status(200).json(products.length ? products : fallbackProducts);
    } catch {
      return res.status(200).json(fallbackProducts);
    }
  }

  if (req.method === "POST") {
    try {
      await connectDB();
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create product" });
    }
  }

  res.status(405).end();
}
