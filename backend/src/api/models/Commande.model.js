import mongoose from "mongoose";

const CommandeSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  adresseId: { type: mongoose.Schema.Types.ObjectId, ref: "Adresse", required: true },
  dateCommande: { type: Date, default: Date.now },
  statut: { type: String, default: "en_attente" }, // ex : en_attente, payé, expédié
  montantTotal: Number,
}, { timestamps: true });

export default mongoose.model("Commande", CommandeSchema);