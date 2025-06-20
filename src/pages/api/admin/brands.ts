import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const brands = await Brand.find();
    return res.status(200).json(brands);
  } else if (req.method === "POST") {
    const { name } = req.body;
    const brand = await Brand.create({ name });
    return res.status(201).json(brand);
  } else if (req.method === "PUT") {
    const { id, name } = req.body;
    const brand = await Brand.findByIdAndUpdate(id, { name }, { new: true });
    return res.status(200).json(brand);
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    await Brand.findByIdAndDelete(id);
    return res.status(204).end();
  } else {
    return res.status(405).end();
  }
}