import { connectDB } from "./mongodb";
import mongoose from "mongoose";

export async function getGiftsById(id: string) {
   await connectDB();
   const db = mongoose.connection?.db;
   if (!db) throw new Error("DB not connected");
 
   const gifts = await db
     .collection("gifts")
     .findOne({ _id: new mongoose.Types.ObjectId(id) });
 
   if (!gifts) return null;
 
   return {
     _id: gifts._id.toString(),
     name_en: gifts.name_en,
     name_hy: gifts.name_hy,
     name_ru: gifts.name_ru,
     price: gifts.price,
     weight: gifts.weight,
     discount: gifts.discount,
     brand: gifts.brand,
     status: gifts.status,
     readyAfter: gifts.readyAfter,
     images: gifts.images,
     link: gifts.link,
   };
}