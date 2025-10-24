import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: {
      type: String,
      enum: [
        "LEAVENED",    // lievitati: cornetti, brioche, panettoni
        "CAKE",        // torte classiche e moderne
        "COOKIE",      // biscotti, pasticceria secca
        "CHOCOLATE",   // praline, tavolette, ganache
        "BREAD",       // pane, focacce, pizze
        "DESSERT",     // mousse, semifreddi, monoporzioni
        "OTHER",       // prodotti non classificabili
      ],
      required: true,
      default: "OTHER",
    },
    catalog: { type: mongoose.Schema.Types.ObjectId, ref: "Catalog" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
