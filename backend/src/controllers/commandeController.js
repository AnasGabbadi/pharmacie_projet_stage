import commandeService from "../services/commandeService.js";

const commandeController = {
  // POST /api/commandes (formulaire public)
  createCommande: async (req, res) => {
    try {
      const commande = await commandeService.createCommande(req.body);
      res.status(201).json(commande);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // GET /api/admin/commandes (dashboard admin)
  getToutesCommandes: async (req, res) => {
    try {
      const commandes = await commandeService.getToutesCommandes();
      res.status(200).json(commandes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET /api/admin/commandes/:id
  getCommandeById: async (req, res) => {
    try {
      const commande = await commandeService.getCommandeById(req.params.id);
      if (!commande) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      res.status(200).json(commande);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // PATCH /api/admin/commandes/:id/statut
  updateStatutCommande: async (req, res) => {
    try {
      const commande = await commandeService.updateStatutCommande(
        req.params.id,
        req.body.statut
      );
      if (!commande) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
      res.status(200).json(commande);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};

export default commandeController;