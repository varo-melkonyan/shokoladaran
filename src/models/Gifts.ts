import mongoose from "mongoose";

const GiftsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  weight: String,
  discount: Number,
  collectionType: String,
  brand: String,
  status: String,
  readyAfter: String,
  image: String,
  ingredients: [String],
  shelfLife: String,
  nutritionFacts: mongoose.Schema.Types.Mixed,
  link: String,
});

export default mongoose.models.Gifts || mongoose.model("Gifts", GiftsSchema);