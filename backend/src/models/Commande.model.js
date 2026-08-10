import mongoose from "mongoose";
import { LigneCommandeSchema } from "./LigneCommande.model.js";

const CommandeSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    nomClient: { type: String, required: true, trim: true },
    emailClient: { type: String, required: true, trim: true },
    telephone: { type: String, required: true, trim: true },
    adresseLivraison: {
      rue: { type: String, required: true },
      ville: { type: String, required: true },
      codePostal: { type: String },
      pays: { type: String, default: "Maroc" },
    },
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
    datePaiement: { type: Date, default: null }, // Date de validation/paiement confirmé
  },
  { timestamps: true }
);

// Index pour recherche par client
CommandeSchema.index({ clientId: 1, createdAt: -1 });
CommandeSchema.index({ statut: 1 });

export default mongoose.model("Commande", CommandeSchema);