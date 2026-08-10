import mongoose from "mongoose";
import Produit from "../models/Produit.model.js";
import Categorie from "../models/Categorie.model.js";

const produitService = {
  // GET /api/produits — recherche + filtres + pagination, tous optionnels et combinables.
  // Réponse : { produits, pagination: { page, limite, total, pages } }.
  getListeProduits: async (query = {}) => {
    const { q, categorie, prixMin, prixMax, disponibilite, page, limite } = query;

    const filter = {};

    // Recherche texte libre (insensible à la casse) sur nom, description,
    // et le nom de la catégorie associée (via une résolution préalable des
    // catégories correspondantes, categorieId étant une référence).
    if (q) {
      const regex = { $regex: q, $options: "i" };
      const categoriesMatch = await Categorie.find({ nom: regex }).select("_id").lean();
      const categorieIds = categoriesMatch.map((c) => c._id);

      filter.$or = [
        { nom: regex },
        { description: regex },
        ...(categorieIds.length ? [{ categorieId: { $in: categorieIds } }] : []),
      ];
    }

    // Filtre catégorie exact (categorieId est un ObjectId — on ignore les valeurs invalides
    // plutôt que de laisser Mongoose lever une CastError).
    if (categorie && mongoose.Types.ObjectId.isValid(categorie)) {
      filter.categorieId = categorie;
    }

    // Fourchette de prix, bornes indépendantes l'une de l'autre.
    const prixFilter = {};
    if (prixMin !== undefined && prixMin !== "" && !isNaN(Number(prixMin))) {
      prixFilter.$gte = Number(prixMin);
    }
    if (prixMax !== undefined && prixMax !== "" && !isNaN(Number(prixMax))) {
      prixFilter.$lte = Number(prixMax);
    }
    if (Object.keys(prixFilter).length > 0) {
      filter.prix = prixFilter;
    }

    // Disponibilité : en_stock (stock > 0) ou rupture (stock <= 0).
    if (disponibilite === "en_stock") {
      filter.stock = { $gt: 0 };
    } else if (disponibilite === "rupture") {
      filter.stock = { $lte: 0 };
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limiteNum = Math.max(1, parseInt(limite) || 20);

    const [produits, total] = await Promise.all([
      Produit.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limiteNum)
        .limit(limiteNum)
        .lean(),
      Produit.countDocuments(filter),
    ]);

    return {
      produits,
      pagination: {
        page: pageNum,
        limite: limiteNum,
        total,
        pages: Math.ceil(total / limiteNum),
      },
    };
  },

  getProduitById: (id) => {
    return Produit.findById(id);
  },

  createProduit: (data) => {
    return Produit.create(data);
  },

  updateProduit: (id, data) => {
    return Produit.findByIdAndUpdate(id, data, { new: true });
  },

  deleteProduit: (id) => {
    return Produit.findByIdAndDelete(id);
  },
};

export default produitService;
