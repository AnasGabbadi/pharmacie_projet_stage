import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ClientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telephone: { type: String, required: true, trim: true },
    motDePasseHash: { type: String, required: true, select: false },
    adresses: [
      {
        rue: { type: String, required: true },
        ville: { type: String, required: true },
        codePostal: { type: String },
        pays: { type: String, default: "Maroc" },
        estPrincipale: { type: Boolean, default: false },
      },
    ],
    role: {
      type: String,
      enum: ["client"],
      default: "client",
    },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Méthode pour comparer les mots de passe
ClientSchema.methods.comparePassword = async function (motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasseHash);
};

export default mongoose.model("Client", ClientSchema);