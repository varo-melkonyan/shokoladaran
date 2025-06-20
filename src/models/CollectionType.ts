import mongoose from "mongoose";

const CollectionTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["collection", "dietary", "children"], required: true },
});

export default mongoose.models.CollectionType ||
  mongoose.model("CollectionType", CollectionTypeSchema);