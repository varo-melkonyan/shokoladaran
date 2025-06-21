import type { NextApiRequest, NextApiResponse } from "next";

let exclusivesProducts: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(exclusivesProducts);
  } else if (req.method === "POST") {
    exclusivesProducts.push(req.body);
    res.status(200).json({ success: true });
  } else if (req.method === "PUT") {
    exclusivesProducts = req.body.exclusivesProducts;
    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { index } = req.query;
    if (typeof index === "string") {
      exclusivesProducts.splice(Number(index), 1);
    }
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}