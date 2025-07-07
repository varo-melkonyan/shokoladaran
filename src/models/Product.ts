import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: String, required: true },
  discount: Number,
  collectionType: { type: String, required: true },
  brand: { type: String, required: true },
  status: { type: String, enum: ["in_stock", "out_of_stock", "pre_order"], required: true },
  readyAfter: String,
  image: String,
  ingredients: [String],
  shelfLife: String,
  nutritionFacts: mongoose.Schema.Types.Mixed,
  link: String,
  stockCount: { type: Number, default: 0 },
  quantityType: { type: String, enum: ["pieces", "kg"], default: "pieces" },
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);