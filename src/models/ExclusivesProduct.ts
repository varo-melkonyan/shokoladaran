import mongoose, { Schema } from "mongoose";

const ExclusivesProductSchema = new Schema({
  name: String,
  image: String,
  order: { type: Number, default: 0 },
});

export default mongoose.models.ExclusivesProduct ||
  mongoose.model("ExclusivesProduct", ExclusivesProductSchema);