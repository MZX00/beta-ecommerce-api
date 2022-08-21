import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentCard = new Schema({
  holderName: { type: String, required: true },
  expDate: { type: String, required: true },
  cardNumber: { type: String, required: true },
  cv: { type: String, required: true },
});

const user = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  admin: { type: Boolean, required: true },
  paymentCard: { type: [paymentCard], required: true },
});

export default mongoose.model("User", user);
