import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    // Numero progressivo fattura
    invoiceNumber: { type: Number, unique: true, index: true },

    // Relazioni principali
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerOrder: { type: mongoose.Schema.Types.ObjectId, ref: "CustomerOrder" },
    purchaseOrder: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder" },

    // Gestione utenti
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // Dati economici
    total: { type: Number, required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["UNPAID", "PAID", "OVERDUE"],
      default: "UNPAID",
    },

    // Note interne
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

///// Middleware: genera numero progressivo unico /////
InvoiceSchema.pre("save", async function (next) {
  if (this.invoiceNumber) return next();

  const currentYear = new Date().getFullYear();

  const lastInvoice = await mongoose
    .model("Invoice")
    .findOne({ issueDate: { $gte: new Date(`${currentYear}-01-01`) } })
    .sort({ invoiceNumber: -1 });

  this.invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
  next();
});

///// Middleware: aggiorna data ultima modifica ///////
InvoiceSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
