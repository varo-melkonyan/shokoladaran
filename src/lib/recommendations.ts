import { connectDB } from "./mongodb";
import mongoose from "mongoose";

function getDb() {
  const db = mongoose.connection?.db;
  if (!db) throw new Error("Database connection not established");
  return db;
}

export async function getRecommendations(productId: string) {
  await connectDB();
  const db = getDb();
  return db.collection("recommendations").findOne({ productId });
}

export async function setRecommendations(productId: string, recommendedProductIds: string[]) {
  await connectDB();
  const db = getDb();
  return db.collection("recommendations").updateOne(
    { productId },
    { $set: { recommendedProductIds } },
    { upsert: true }
  );
}