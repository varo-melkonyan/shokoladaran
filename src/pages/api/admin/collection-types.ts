import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/lib/mongodb";
import CollectionType from "@/models/CollectionType";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const types = await CollectionType.find();
    return res.status(200).json(types);
  }

  if (req.method === "POST") {
    const { name, type } = req.body;
    const newType = await CollectionType.create({ name, type });
    return res.status(201).json(newType);
  }

  if (req.method === "PUT") {
    const { id, name, type } = req.body;
    const updated = await CollectionType.findByIdAndUpdate(id, { name, type }, { new: true });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    await CollectionType.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.status(405).end();
}