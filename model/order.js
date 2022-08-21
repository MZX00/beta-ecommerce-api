import mongoose from "mongoose";
// import user from "./user";
// import address from "./address";
const { Schema } = mongoose;

const products = new Schema({
  _id: { type: Schema.ObjectId, requried: true },
  quantity: { type: Number, requried: true },
  size: { type: String },
  color: { type: String },
});

const paymentInfo = new Schema({
  cash: { type: Boolean, required: true },
  cardInfo: { type: "ObjectId", ref: "paymentCard" },
});

const order = new Schema({
  userid: { type: Schema.ObjectId, required: true },
  dateCreated: { type: Date, required: true },
  status: { type: String, required: true },
  cost: { type: Number, required: true },
  address: { type: "ObjectId", ref: "address" },
});

export default mongoose.model("Order", order);
