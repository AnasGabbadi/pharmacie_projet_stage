import mongoose from "mongoose";

const UtilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasseHash: { type: String, required: true },
  telephone: { type: String },
}, { timestamps: true });

export default mongoose.model("Utilisateur", UtilisateurSchema);