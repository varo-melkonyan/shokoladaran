import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema);