import mongoose from "mongoose";

const AdresseSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  rue: String,
  ville: String,
  codePostal: String,
  pays: String,
}, { timestamps: true });

export default mongoose.model("Adresse", AdresseSchema);