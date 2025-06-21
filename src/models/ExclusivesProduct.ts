import mongoose, { Schema } from "mongoose";

const ExclusivesProductSchema = new Schema({
  name: String,
  brand: String
});

export default mongoose.models.ExclusivesProduct ||
  mongoose.model("ExclusivesProduct", ExclusivesProductSchema);