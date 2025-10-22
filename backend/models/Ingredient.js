import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ["g", "kg", "ml", "l", "pcs"], default: "kg" },
    cost: { type: Number, required: true },
    expirationDate: { type: Date },
  },
  { timestamps: true }
);

const Ingredient = mongoose.model("Ingredient", IngredientSchema);
export default Ingredient;
