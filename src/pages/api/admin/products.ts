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
    const newProduct = await Product.create(req.body);
    return res.status(201).json(newProduct);
  }

  if (req.method === "PUT") {
    const updated = req.body;
    const product = await Product.findByIdAndUpdate(updated.id, updated, { new: true });
    return res.status(200).json(product);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await Product.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).end();
}