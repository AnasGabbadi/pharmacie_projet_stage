import mongoose from "mongoose";

const LignePanierSchema = new mongoose.Schema({
  panierId: { type: mongoose.Schema.Types.ObjectId, ref: "Panier", required: true },
  produitId: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
  quantite: { type: Number, required: true, min: 1 },
}, { timestamps: true });

export default mongoose.model("LignePanier", LignePanierSchema);