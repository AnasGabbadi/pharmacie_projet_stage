import Categorie from "../models/Categorie.model.js";

const categorieService = {
  getListeCategories: () => {
    return Categorie.find();
  },

  getcategorieById: (id) => {
    return Categorie.findById(id);
  },

  createCategorie: (data) => {
    return Categorie.create(data);
  },

  updateCategorie: (id, data) => {
    return Categorie.findByIdAndUpdate(id, data, { new: true });
  },

  deleteCategorie: (id) => {
    return Categorie.findByIdAndDelete(id);
  },
};

export default categorieService;
