import commandeService from "../services/commandeService.js";

const commandeController = {
  // POST /commandes — Passer commande (client authentifié)
  checkout: async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId || !req.user) {
        return res.status(401).json({ success: false, message: "Authentification requise" });
      }

      const { adresseLivraison, telephone, modePaiement, montantTotal } = req.body;

      // Validation champs requis du schema Commande
      if (!adresseLivraison?.rue || !adresseLivraison?.ville) {
        return res.status(400).json({ success: false, message: "Adresse de livraison incomplète (rue et ville obligatoires)" });
      }
      if (!telephone) {
        return res.status(400).json({ success: false, message: "Téléphone obligatoire" });
      }
      if (modePaiement && !["COD"].includes(modePaiement)) {
        return res.status(400).json({ success: false, message: "Mode de paiement invalide (COD uniquement)" });
      }

      // ✅ commandeService (pas cartService)
      const commande = await commandeService.createCommande({
        clientId: userId,
        nomClient: req.user.nom,
        emailClient: req.user.email,
        telephone,
        adresseLivraison,
        modePaiement: modePaiement || "COD",
        montantTotal,
      });

      res.status(201).json({ success: true, data: commande });
    } catch (error) {
      console.error("❌ Erreur checkout:", error);
      res.status(500).json({ success: false, message: error.message || "Erreur serveur" });
    }
  },

  // GET /admin/commandes — Toutes les commandes (admin)
  getToutesCommandes: async (req, res) => {
    try {
      const commandes = await commandeService.getToutesCommandes();
      res.status(200).json({ success: true, data: commandes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /admin/commandes/:id
  getCommandeById: async (req, res) => {
    try {
      const commande = await commandeService.getCommandeById(req.params.id);
      if (!commande) {
        return res.status(404).json({ success: false, message: "Commande non trouvée" });
      }
      res.status(200).json({ success: true, data: commande });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PATCH /admin/commandes/:id/statut
  updateStatutCommande: async (req, res) => {
    try {
      const { statut } = req.body;
      const statutsValides = ["en_attente", "validee", "preparee", "livree", "annulee"];
      if (!statutsValides.includes(statut)) {
        return res.status(400).json({ success: false, message: `Statut invalide. Valeurs: ${statutsValides.join(", ")}` });
      }

      const commande = await commandeService.updateStatutCommande(req.params.id, statut);
      if (!commande) {
        return res.status(404).json({ success: false, message: "Commande non trouvée" });
      }
      res.status(200).json({ success: true, data: commande });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // GET /client/commandes — Commandes du client connecté
  getMesCommandes: async (req, res) => {
    try {
      const userId = req.user?.id || req.user?._id;
      const commandes = await commandeService.getCommandesByClient(userId.toString());
      res.status(200).json({ success: true, data: commandes });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

export default commandeController;