import mongoose from "mongoose";

const CatalogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Catalog = mongoose.model("Catalog", CatalogSchema);
export default Catalog;
