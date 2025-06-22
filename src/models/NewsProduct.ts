import mongoose, { Schema } from "mongoose";

const NewsProductSchema = new Schema({
  name: String,
  image: String,
  order: { type: Number, default: 0 },
});

export default mongoose.models.NewsProduct ||
  mongoose.model("NewsProduct", NewsProductSchema);