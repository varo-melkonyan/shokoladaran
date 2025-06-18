import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { NextApiRequest, NextApiResponse } from "next";

const filePath = path.join(process.cwd(), "src/data/collectionTypes.json");

function readCollectionTypes() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeCollectionTypes(collectionTypes: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(collectionTypes, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(readCollectionTypes());
  }
  if (req.method === "POST") {
    const collectionTypes = readCollectionTypes();
    const { name, type } = req.body; // type: "collection" or "dietary"
    const newType = { id: uuidv4(), name, type };
    collectionTypes.push(newType);
    writeCollectionTypes(collectionTypes);
    return res.status(201).json(newType);
  }
  if (req.method === "PUT") {
    const { id, name, type } = req.body;
    let collectionTypes = readCollectionTypes();
    collectionTypes = collectionTypes.map(t => t.id === id ? { ...t, name, type } : t);
    writeCollectionTypes(collectionTypes);
    return res.status(200).json({ id, name, type });
  }
  if (req.method === "DELETE") {
    const { id } = req.query;
    let collectionTypes = readCollectionTypes();
    collectionTypes = collectionTypes.filter(t => t.id !== id);
    writeCollectionTypes(collectionTypes);
    return res.status(204).end();
  }
  res.status(405).end();
}