import clientService from "../services/clientService.js";

// Gestion des adresses du client connecté (req.user.id, posé par authMiddleware).
// Toutes les opérations sont scoped au client courant : un client ne peut agir
// que sur ses propres adresses (clientService recharge le client par req.user.id
// puis résout le sous-document par _id — jamais de recherche adresse-first qui
// pourrait fuiter vers un autre client).
const clientController = {
  getAdresses: async (req, res) => {
    try {
      const result = await clientService.listAddresses(req.user.id);
      res.status(result.statusCode).json(result);
    } catch (error) {
      console.error("Erreur getAdresses:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  addAdresse: async (req, res) => {
    try {
      const { rue, ville, codePostal, pays, estPrincipale } = req.body;
      const result = await clientService.addAddress(req.user.id, {
        rue, ville, codePostal, pays, estPrincipale,
      });
      res.status(result.statusCode).json(result);
    } catch (error) {
      console.error("Erreur addAdresse:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  updateAdresse: async (req, res) => {
    try {
      const { rue, ville, codePostal, pays, estPrincipale } = req.body;
      const result = await clientService.updateAddress(req.user.id, req.params.addressId, {
        rue, ville, codePostal, pays, estPrincipale,
      });
      res.status(result.statusCode).json(result);
    } catch (error) {
      console.error("Erreur updateAdresse:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  deleteAdresse: async (req, res) => {
    try {
      const result = await clientService.deleteAddress(req.user.id, req.params.addressId);
      res.status(result.statusCode).json(result);
    } catch (error) {
      console.error("Erreur deleteAdresse:", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },
};

export default clientController;
