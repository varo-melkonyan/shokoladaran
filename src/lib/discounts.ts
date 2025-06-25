import { connectDB } from "./mongodb";
import mongoose from "mongoose";

export async function getAllDiscountedProducts() {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection failed");
  return db
    .collection("products")
    .find({ discount: { $exists: true, $ne: null } })
    .toArray();
}
