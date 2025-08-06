import mongoose from "mongoose";

const CollectionTypeSchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_hy: { type: String, required: true },
  name_ru: { type: String, required: true },
  type: { type: String, enum: ["collection", "children", "dietary"], required: true },
});

export default mongoose.models.CollectionType || mongoose.model("CollectionType", CollectionTypeSchema);