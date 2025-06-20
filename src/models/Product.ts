import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  price: Number,
  discount: Number,
  image: String,
  weight: String,
  collectionType: String,
  status: String,
  ingredients: [String],
  shelfLife: String,
  nutritionFacts: mongoose.Schema.Types.Mixed,
  // Add other fields as needed
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);