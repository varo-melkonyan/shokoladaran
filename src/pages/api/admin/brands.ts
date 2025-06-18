import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "src/data/brands.json");

function readBrands() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeBrands(brands: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(brands, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(readBrands());
  }
  if (req.method === "POST") {
    const brands = readBrands();
    const { name } = req.body;
    const newBrand = { id: uuidv4(), name };
    brands.push(newBrand);
    writeBrands(brands);
    return res.status(201).json(newBrand);
  }
  if (req.method === "PUT") {
    const { id, name } = req.body;
    let brands = readBrands();
    brands = brands.map(b => b.id === id ? { ...b, name } : b);
    writeBrands(brands);
    return res.status(200).json({ id, name });
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    let brands = readBrands();
    brands = brands.filter(b => b.id !== id);
    writeBrands(brands);
    return res.status(204).end();
  }
  res.status(405).end();
}