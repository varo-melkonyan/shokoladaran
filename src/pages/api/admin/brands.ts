import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const brands = await Brand.find();
    return res.status(200).json(brands);
  } else if (req.method === "POST") {
    const { name, image, description, website } = req.body;
    const brand = await Brand.create({ name, image, description, website });
    return res.status(201).json(brand);
  } else if (req.method === "PUT") {
    const { id, name, ...rest } = req.body;
    const brand = await Brand.findByIdAndUpdate(id, { name, ...rest }, { new: true });
    return res.status(200).json(brand);
  } else if (req.method === "DELETE") {
  const { id } = req.query;

  if (!id || typeof id !== "string" || id.length !== 24) {
    return res.status(400).json({ error: "Invalid or missing ID" });
  }

  try {
    await Brand.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Delete failed" });
  }
}
 else {
    return res.status(405).end();
  }
}