import mongoose from "mongoose";

const ProduitSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    prix: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    categorieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorie",
      required: false,
    },
    imageUrl: { type: String, trim: true },
    actif: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Produit", ProduitSchema);