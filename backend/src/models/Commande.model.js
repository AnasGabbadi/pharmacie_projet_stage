import mongoose from "mongoose";
import { LigneCommandeSchema } from "./LigneCommande.model.js";

const CommandeSchema = new mongoose.Schema(
  {
    nomClient: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    adresseLivraison: { type: String, required: true, trim: true },
    lignes: {
      type: [LigneCommandeSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Une commande doit contenir au moins un produit.",
      },
    },
    montantTotal: { type: Number, required: true, min: 0 },
    modePaiement: {
      type: String,
      enum: ["COD"],
      default: "COD",
    },
    dateCommande: { type: Date, default: Date.now },
    statut: {
      type: String,
      enum: ["en_attente", "validee", "preparee", "livree", "annulee"],
      default: "en_attente",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Commande", CommandeSchema);