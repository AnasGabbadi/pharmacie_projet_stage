import mongoose from "mongoose";

export const LigneCommandeSchema = new mongoose.Schema(
  {
    produitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Produit",
      required: true,
    },
    nomProduit: { type: String, required: true },
    prixUnitaire: { type: Number, required: true, min: 0 },
    quantite: { type: Number, required: true, min: 1 },
  },
  {
    _id: false,
    timestamps: false,
  }
);
