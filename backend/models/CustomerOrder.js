import mongoose from "mongoose";

const CustomerOrderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

const CustomerOrder = mongoose.model("CustomerOrder", CustomerOrderSchema);
export default CustomerOrder;
