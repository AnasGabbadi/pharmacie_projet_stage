import mongoose from "mongoose";

const UtilisateurSchema = new mongoose.Schema(
    {
        nom: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        motDePasseHash: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: ["admin"],
            default: "admin",
        },
    },{ timestamps: true }
);

export default mongoose.model("Utilisateur", UtilisateurSchema);