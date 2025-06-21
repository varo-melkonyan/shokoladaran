import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  weight: String,
  discount: Number,
  collectionType: String,
  brand: String,
  status: String,
  image: String,
  ingredients: [String],
  shelfLife: String,
  nutritionFacts: mongoose.Schema.Types.Mixed,
  link: String,
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);