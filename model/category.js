import mongoose from "mongoose";
const { Schema } = mongoose;

const category = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  subCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

export default mongoose.model("Category", category);
