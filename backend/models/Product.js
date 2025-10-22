import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog" },
    customerOrder: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerOrder" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
