import mongoose, { Schema, models, model } from "mongoose";

const CollectionTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["collection", "dietary", "children"],
    required: true,
  },
});

const CollectionType =
  models.CollectionType || model("CollectionType", CollectionTypeSchema);

export default CollectionType;
