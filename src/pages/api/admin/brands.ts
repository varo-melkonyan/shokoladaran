import type { NextApiRequest, NextApiResponse } from "next";
import Brand from "@/models/Brand";
import { connectDB } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const brands = await Brand.find();
    res.status(200).json(brands);
  } else if (req.method === "POST") {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    res.status(201).json(brand);
  } else if (req.method === "PUT") {
    const { id, name } = req.body;
    const brand = await Brand.findByIdAndUpdate(id, { name }, { new: true });
    res.status(200).json(brand);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    await Brand.findByIdAndDelete(id);
    res.status(204).end();
  } else {
    res.status(405).end();
  }
}