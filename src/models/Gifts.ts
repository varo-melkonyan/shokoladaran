import mongoose from "mongoose";

const GiftsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: String, required: true },
  discount: Number,
  brand: { type: String, required: true },
  status: { type: String, required: true },
  readyAfter: String,
  images: [String],
  link: String,
  order: { type: Number, default: 0 },
  stockCount: { type: Number, default: 0 },
  quantityType: { type: String, enum: ["pieces", "kg"], default: "pieces" },
});

export default mongoose.models.Gifts || mongoose.model("Gifts", GiftsSchema);