import mongoose from "mongoose";

const ProduitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  prix: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  necessiteOrdonnance: { type: Boolean, default: false },
  categorieId: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie" },
}, { timestamps: true });

export default mongoose.model("Produit", ProduitSchema);