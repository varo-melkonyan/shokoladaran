import { connectDB } from "./mongodb";
import mongoose from "mongoose";

export type Product = {
  _id: string;
  name: string;
  price: number;
  weight?: string;
  discount?: number;
  collectionType?: string;
  brand?: string;
  status?: string;
  image?: string;
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: any;
  link?: string;
  description?: string;
};

export async function getProductById(id: string): Promise<Product | null> {
  await connectDB();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection failed");
  const product = await db
    .collection("products")
    .findOne({ _id: new mongoose.Types.ObjectId(id) });
  if (!product) return null;
  return {
    _id: product._id.toString(),
    name: product.name,
    price: product.price,
    weight: product.weight,
    discount: product.discount,
    collectionType: product.collectionType,
    brand: product.brand,
    status: product.status,
    image: product.image,
    ingredients: product.ingredients,
    shelfLife: product.shelfLife,
    nutritionFacts: product.nutritionFacts,
    link: product.link,
    description: product.description,
  };
}
