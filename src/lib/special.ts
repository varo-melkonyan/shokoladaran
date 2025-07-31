import { connectDB } from "./mongodb";
import mongoose from "mongoose";

export async function getSpecialsById(id: string) {
   await connectDB();
   const db = mongoose.connection?.db;
   if (!db) throw new Error("DB not connected");
 
   const specials = await db
     .collection("specials")
     .findOne({ _id: new mongoose.Types.ObjectId(id) });
 
   if (!specials) return null;
 
   return {
     _id: specials._id.toString(),
     name: specials.name,
     price: specials.price,
     weight: specials.weight,
     discount: specials.discount,
     brand: specials.brand,
     status: specials.status,
     readyAfter: specials.readyAfter,
     images: specials.images,
     link: specials.link,
   };
}