import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { BestSeller } from "@/types/bestSellersProduct";

const filePath = path.join(process.cwd(), "src/data/bestSellers.json");

function readBestSellers(): BestSeller[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeBestSellers(bestSellers: BestSeller[]) {
  // fs.writeFileSync(filePath, JSON.stringify(bestSellers, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(readBestSellers());
  }
  if (req.method === "POST") {
    const bestSellers = readBestSellers();
    bestSellers.push(req.body);
    writeBestSellers(bestSellers);
    return res.status(201).json(req.body);
  }
  if (req.method === "PUT") {
    const { bestSellers } = req.body;
    // fs.writeFileSync(filePath, JSON.stringify(bestSellers, null, 2), "utf-8");
    return res.status(200).json({ success: true });
  }
  
  if (req.method === "DELETE") {
    const { index } = req.query;
    const bestSellers = readBestSellers();
    bestSellers.splice(Number(index), 1);
    writeBestSellers(bestSellers);
    return res.status(204).end();
  }
  res.status(405).end();
}