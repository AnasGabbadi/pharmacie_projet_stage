import produitService from "../services/produitService.js";

const produitController = {
  // GET /api/produits
  getProduits: async (req, res) => {
    try {
      const produits = await produitService.getListeProduits();
      res.status(200).json(produits);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET /api/produits/:id
  getProduitById: async (req, res) => {
    try {
      const produit = await produitService.getProduitById(req.params.id);
      if (!produit) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.status(200).json(produit);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // POST /api/produits
  createProduit: async (req, res) => {
    try {
      const nouveauProduit = await produitService.createProduit(req.body);
      res.status(201).json(nouveauProduit);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // PUT /api/produits/:id
  updateProduit: async (req, res) => {
    try {
      const produitMisAJour = await produitService.updateProduit(
        req.params.id,
        req.body
      );
      if (!produitMisAJour) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.status(200).json(produitMisAJour);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // DELETE /api/produits/:id
  deleteProduit: async (req, res) => {
    try {
      const supprime = await produitService.deleteProduit(req.params.id);
      if (!supprime) {
        return res.status(404).json({ message: "Produit non trouvé" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default produitController;
