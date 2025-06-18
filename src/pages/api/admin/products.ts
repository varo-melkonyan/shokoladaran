import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";
import { Product } from "@/types/product";

const filePath = path.join(process.cwd(), "src/data/products.json");

function readProducts(): Product[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(readProducts());
  }
  if (req.method === "POST") {
    const products = readProducts();
    const newProduct = { ...req.body, id: req.body.id || uuidv4() };
    products.push(newProduct);
    writeProducts(products);
    return res.status(201).json(newProduct);
  }
  if (req.method === "PUT") {
    const updated = req.body;
    let products = readProducts();
    products = products.map(p => p.id === updated.id ? updated : p);
    writeProducts(products);
    return res.status(200).json(updated);
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    const products = readProducts().filter(p => p.id !== id);
    writeProducts(products);
    return res.status(204).end();
  }
  res.status(405).end();
}