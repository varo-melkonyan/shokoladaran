import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/exclusivesProducts.json");

function readData() {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(data: any) {
  // fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === "POST") {
    const data = readData();
    data.push(req.body);
    writeData(data);
    res.status(200).json({ success: true });
  } else if (req.method === "PUT") {
    writeData(req.body.exclusivesProducts);
    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const data = readData();
    const { index } = req.query;
    if (typeof index === "string") {
      data.splice(Number(index), 1);
      writeData(data);
    }
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}