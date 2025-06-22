import mongoose, { Schema } from "mongoose";

const BestSellersProductSchema = new Schema({
  name: String,
  image: String,
  order: { type: Number, default: 0 },
});

export default mongoose.models.BestSellersProduct ||
  mongoose.model("BestSellersProduct", BestSellersProductSchema);