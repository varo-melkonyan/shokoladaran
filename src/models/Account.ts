import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: String,
  country: String,
  deliveryAddress: String,
  orders: [
    {
      id: Number,
      cart: Array,
      form: Object,
      deliveryType: String,
      status: String,
      createdAt: String,
    }
  ],
});

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);