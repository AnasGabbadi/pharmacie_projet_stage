import mongoose from "mongoose";
import { LignePanierSchema } from "./LignePanier.model.js";

const CommandeSchema = new mongoose.Schema({
  nomClient: { type: String, required: true },
  adresseLivraison: { type: String, required: true },
  lignes: [LignePanierSchema],
  dateCommande: { type: Date, default: Date.now },
  statut: {
    type: String,
    enum: ["en_attente", "validee", "preparee", "livree", "annulee"],
    default: "en_attente",
  },
  telephone: { type: String, required: true },
  montantTotal: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model("Commande", CommandeSchema);