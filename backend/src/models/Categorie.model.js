import mongoose from "mongoose";

const CategorieSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    slug: { type: String, trim: true, lowercase: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Categorie", CategorieSchema);