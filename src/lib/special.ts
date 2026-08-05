import { connectDB } from "./mongodb";
import mongoose from "mongoose";
import { fallbackSpecials } from "@/data/fallbackCatalog";

export async function getSpecialsById(id: string) {
   const fallback = fallbackSpecials.find((special) => special._id === id);
   try {
     await connectDB();
     const db = mongoose.connection?.db;
     if (!db || !mongoose.Types.ObjectId.isValid(id)) return fallback || null;
 
   const specials = await db
     .collection("specials")
     .findOne({ _id: new mongoose.Types.ObjectId(id) });
 
   if (!specials) return fallback || null;
 
   return {
     _id: specials._id.toString(),
     name_en: specials.name_en,
     name_hy: specials.name_hy,
     name_ru: specials.name_ru,
     price: specials.price,
     weight: specials.weight,
     discount: specials.discount,
     brand: specials.brand,
     status: specials.status,
     readyAfter: specials.readyAfter,
     images: specials.images,
     link: specials.link,
   };
   } catch {
     return fallback || null;
   }
}
