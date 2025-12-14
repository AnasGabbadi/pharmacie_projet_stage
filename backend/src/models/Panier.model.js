import mongoose from "mongoose";
import { LignePanierSchema } from "./LignePanier.model.js";

const PanierSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    lignes: [LignePanierSchema],
    montantTotal: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Panier", PanierSchema);
