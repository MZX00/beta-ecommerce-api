import mongoose from "mongoose";
const { Schema } = mongoose;

const address = new Schema({
  userId: { type: Schema.ObjectId, required: true },
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

export default mongoose.model("Address", address);
