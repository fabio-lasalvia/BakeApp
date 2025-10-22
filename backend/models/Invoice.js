import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    customerOrder: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerOrder" },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },
    total: { type: Number, required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["UNPAID", "PAID", "OVERDUE"],
      default: "UNPAID",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
