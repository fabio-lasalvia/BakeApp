import mongoose from "mongoose";

const PurchaseOrderSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ingredient" }],
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ORDERED", "RECEIVED", "CANCELLED"],
      default: "PENDING",
    },
    orderDate: { type: Date, default: Date.now },
    expectedDelivery: { type: Date },
  },
  { timestamps: true }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", PurchaseOrderSchema);
export default PurchaseOrder;
