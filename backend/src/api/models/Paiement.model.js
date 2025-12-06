import mongoose from "mongoose";

const PaiementSchema = new mongoose.Schema({
  commandeId: { type: mongoose.Schema.Types.ObjectId, ref: "Commande", required: true },
  datePaiement: { type: Date, default: Date.now },
  montant: { type: Number, required: true },
  methodePaiement: { type: String, enum: ["carte", "paypal", "cash"], required: true },
}, { timestamps: true });

export default mongoose.model("Paiement", PaiementSchema);