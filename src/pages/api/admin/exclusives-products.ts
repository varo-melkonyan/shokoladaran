import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import ExclusivesProduct from "@/models/ExclusivesProduct";

const MONGODB_URI = process.env.MONGODB_URI as string;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const products = await ExclusivesProduct.find();
    res.status(200).json(products);
  } else if (req.method === "POST") {
    const product = await ExclusivesProduct.create(req.body);
    res.status(200).json(product);
  } else if (req.method === "PUT") {
    // Update order or edit product
    if (req.body.index !== undefined) {
      // Edit product at index
      const products = await ExclusivesProduct.find();
      const product = products[req.body.index];
      if (product) {
        await ExclusivesProduct.findByIdAndUpdate(product._id, req.body);
        res.status(200).json({ success: true });
      } else {
        res.status(404).json({ error: "Not found" });
      }
    } else if (Array.isArray(req.body.exclusivesProducts)) {
      // Reorder: update all products
      // (You may want to store an "order" field in the DB for this)
      for (let i = 0; i < req.body.exclusivesProducts.length; i++) {
        await ExclusivesProduct.findByIdAndUpdate(
          req.body.exclusivesProducts[i]._id,
          { $set: { order: i } }
        );
      }
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: "Invalid PUT body" });
    }
  } else if (req.method === "DELETE") {
    const { index } = req.query;
    const products = await ExclusivesProduct.find();
    const product = products[Number(index)];
    if (product) {
      await ExclusivesProduct.findByIdAndDelete(product._id);
    }
    res.status(200).json({ success: true });
  } else {
    res.status(405).end();
  }
}