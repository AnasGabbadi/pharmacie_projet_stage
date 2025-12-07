import Produit from "../models/Produit.model.js";

const produitService = {
  getListeProduits: () => {
    return Produit.find();
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
