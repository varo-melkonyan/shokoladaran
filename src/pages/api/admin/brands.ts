import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import { fallbackBrands } from "@/data/fallbackCatalog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      await connectDB();
      const brands = await Brand.find();
      return res.status(200).json(brands.length ? brands : fallbackBrands);
    } catch {
      return res.status(200).json(fallbackBrands);
    }
  } else if (req.method === "POST") {
    await connectDB();
    const { name_en, name_hy, name_ru, image, description, website } = req.body;
    const brand = await Brand.create({ name_en, name_hy, name_ru, image, description, website });
    return res.status(201).json(brand);
  } else if (req.method === "PUT") {
    await connectDB();
    const { id, name_en, name_hy, name_ru, ...rest } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      id,
      { name_en, name_hy, name_ru, ...rest },
      { new: true }
    );
    return res.status(200).json(brand);
  } else if (req.method === "DELETE") {
    await connectDB();
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
  } else {
    return res.status(405).end();
  }
}
