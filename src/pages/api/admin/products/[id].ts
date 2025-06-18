import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const PRODUCTS_PATH = path.join(process.cwd(), "src/data/products.json");

function readProducts() {
  const data = fs.readFileSync(PRODUCTS_PATH, "utf-8");
  return JSON.parse(data);
}

function writeProducts(products: any[]) {
  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const products = readProducts();
    const idx = products.findIndex((p: any) => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    products[idx] = req.body;
    writeProducts(products);
    return res.status(200).json(products[idx]);
  }

  if (req.method === "DELETE") {
    const products = readProducts();
    const filtered = products.filter((p: any) => p.id !== id);
    writeProducts(filtered);
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}