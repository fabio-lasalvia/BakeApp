import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true },
    unit: { type: String, enum: ["g", "kg", "ml", "l", "pcs"], default: "kg" },
    cost: { type: Number, required: true },
    image: { type: String },
    expirationDate: { type: Date },
  },
  { timestamps: true }
);

const Ingredient = mongoose.model("Ingredient", IngredientSchema);
export default Ingredient;
