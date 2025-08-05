import { connectDB } from "./mongodb";
import mongoose from "mongoose";

export type Product = {
  _id: string;
  name_en: string;
  name_hy: string;
  name_ru: string;
  price: number;
  weight?: string;
  discount?: number;
  collectionType?: string;
  brand?: string;
  status?: string;
  readyAfter?: string; // e.g. "2 days"
  images?: string[];
  ingredients?: string[];
  shelfLife?: string;
  nutritionFacts?: any;
  link?: string;
  description?: string;
};

export async function getProductById(id: string): Promise<Product | null> {
  await connectDB();
  const db = mongoose.connection?.db;
  if (!db) throw new Error("DB not connected");

  const product = await db
    .collection("products")
    .findOne({ _id: new mongoose.Types.ObjectId(id) });

  if (!product) return null;

  return {
    _id: product._id.toString(),
    name_en: product.name_en,
    name_hy: product.name_hy,
    name_ru: product.name_ru,
    price: product.price,
    weight: product.weight,
    discount: product.discount,
    collectionType: product.collectionType,
    brand: product.brand,
    status: product.status,
    readyAfter: product.readyAfter,
    images: product.images,
    ingredients: product.ingredients,
    shelfLife: product.shelfLife,
    nutritionFacts: product.nutritionFacts,
    link: product.link,
    description: product.description,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  await connectDB();
  const db = mongoose.connection?.db;
  if (!db) throw new Error("Database connection failed");

  const products = await db.collection("products").find({}).toArray();

  return products.map((product) => ({
    _id: product._id.toString(),
    name_en: product.name_en,
    name_hy: product.name_hy,
    name_ru: product.name_ru,
    price: product.price,
    weight: product.weight,
    discount: product.discount,
    collectionType: product.collectionType,
    brand: product.brand,
    status: product.status,
    readyAfter: product.readyAfter,
    image: product.image,
    ingredients: product.ingredients,
    shelfLife: product.shelfLife,
    nutritionFacts: product.nutritionFacts,
    link: product.link,
    description: product.description,
  }));
}

export async function getProductsByIds(ids: string[]) {
  if (!ids.length) return [];
  await connectDB();
  const db = mongoose.connection?.db;
  if (!db) throw new Error("DB not connected");
  const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
  const products = await db
    .collection("products")
    .find({ _id: { $in: objectIds } })
    .toArray();
  return products.map((product) => ({
    _id: product._id.toString(),
    name: product.name,
    name_en: product.name_en,
    name_hy: product.name_hy,
    name_ru: product.name_ru,
    price: product.price,
    weight: product.weight,
    discount: product.discount,
    collectionType: product.collectionType,
    brand: product.brand,
    status: product.status,
    readyAfter: product.readyAfter,
    images: product.images,
    ingredients: product.ingredients,
    shelfLife: product.shelfLife,
    nutritionFacts: product.nutritionFacts,
    link: product.link,
    description: product.description,
  }));
}
