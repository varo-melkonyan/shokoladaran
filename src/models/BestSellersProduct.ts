import mongoose, { Schema } from "mongoose";

const BestSellersProductSchema = new Schema({
  name: String,
  price: Number,
  discount: Number,
  weight: String,
  collectionType: String,
  brand: String,
  status: String,
  readyAfter: String, // e.g. "2 days"
  image: String,
  ingredients: [String],
  shelfLife: String,
  nutritionFacts: Schema.Types.Mixed,
  link: String,
  order: { type: Number, default: 0 },
});

export default mongoose.models.BestSellersProduct ||
  mongoose.model("BestSellersProduct", BestSellersProductSchema);