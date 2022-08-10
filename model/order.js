import mongoose from "mongoose";
const { Schema } = mongoose;

const products = new Schema({
  id: { type: ObjectID, requried: true },
  quantity: { type: Number, requried: true },
  size: { type: String },
  color: { type: String },
});

const order = new Schema({
  userid: { type: Schema.ObjectId, required: true },
  products: { type: [products], required: true },
  dateCreated: { type: Date, required: true },
  status: { type: String, required: true },
  cost: { type: Number, required: true },
});

export default mongoose.model("Order", order);
