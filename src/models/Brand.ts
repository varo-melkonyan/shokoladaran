import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name_en: { type: String, required: true },
  name_hy: { type: String, required: true },
  name_ru: { type: String, required: true },
  image: String,
  description: String,
  website: String,
});

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);