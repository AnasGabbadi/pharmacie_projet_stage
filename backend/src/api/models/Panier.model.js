import mongoose from "mongoose";

const PanierSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
}, { timestamps: true });

export default mongoose.model("Panier", PanierSchema);