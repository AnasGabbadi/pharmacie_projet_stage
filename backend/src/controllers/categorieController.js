
const categorieController = {
  // GET /api/categories
  getCategories: async (req, res) => {
    try {
      const categories = await categorieService.getListecategories();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET /api/categories/:id
  getCategorieById: async (req, res) => {
    try {
      const categorie = await categorieService.getcategorieById(req.params.id);
      if (!categorie) {
        return res.status(404).json({ message: "categorie non trouvé" });
      }
      res.status(200).json(categorie);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // POST /api/categories
  createCategorie: async (req, res) => {
    try {
      const nouveaucategorie = await categorieService.createcategorie(req.body);
      res.status(201).json(nouveaucategorie);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // PUT /api/categories/:id
  updateCategorie: async (req, res) => {
    try {
      const categorieMisAJour = await categorieService.updatecategorie(
        req.params.id,
        req.body
      );
      if (!categorieMisAJour) {
        return res.status(404).json({ message: "categorie non trouvé" });
      }
      res.status(200).json(categorieMisAJour);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // DELETE /api/categories/:id
  deleteCategorie: async (req, res) => {
    try {
      const supprime = await categorieService.deletecategorie(req.params.id);
      if (!supprime) {
        return res.status(404).json({ message: "categorie non trouvé" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default categorieController;
