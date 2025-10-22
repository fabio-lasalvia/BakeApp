import mongoose from "mongoose";

const CatalogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Catalog = mongoose.model("Catalog", CatalogSchema);
export default Catalog;
