import mongoose, { Schema } from "mongoose";

const ExclusivesProductSchema = new Schema({
  name: String,
  price: Number,
  discount: Number,
  weight: String,
  collectionType: String,
  brand: String,
  status: String,
  readyAfter: String, // e.g. "2 days"
  images: [String],
  ingredients: [String],
  shelfLife: String,
  nutritionFacts: Schema.Types.Mixed,
  link: String,
  order: { type: Number, default: 0 },
  stockCount: { type: Number, default: 0 },
  quantityType: { type: String, enum: ["pieces", "kg"], default: "pieces" },
});

export default mongoose.models.ExclusivesProduct ||
  mongoose.model("ExclusivesProduct", ExclusivesProductSchema);