import mongoose from "mongoose";

const CategorieSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
}, { timestamps: true });

export default mongoose.model("Categorie", CategorieSchema);