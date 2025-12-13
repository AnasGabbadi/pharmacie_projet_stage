import Commande from "../models/Commande.model.js";

const commandeService = {
  createCommande: (data) => {
    return Commande.create(data);
  },

  getToutesCommandes: () => {
    return Commande.find().sort({ createdAt: -1 });
  },

  getCommandeById: (id) => {
    return Commande.findById(id);
  },

  updateStatutCommande: (id, nouveauStatut) => {
    return Commande.findByIdAndUpdate(
      id,
      { statut: nouveauStatut },
      { new: true }
    );
  },
};

export default commandeService;