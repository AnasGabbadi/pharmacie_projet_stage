import Commande from "../models/Commande.model.js";
import Cart from "../models/cartModel.js";
import Produit from "../models/Produit.model.js";

const commandeService = {

  // ── Créer une commande depuis le panier actif ─────────────
  createCommande: async ({ clientId, nomClient, emailClient, telephone, adresseLivraison, modePaiement, montantTotal }) => {
    // 1. Récupérer le panier actif du client
    const cart = await Cart.findOne({ userId: clientId.toString(), status: "active" })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new Error("Panier vide ou introuvable");
    }

    // 2. Construire les lignes de commande (LigneCommande)
    const lignes = cart.items.map((item) => {
      const product = item.product;
      if (!product) throw new Error(`Produit introuvable dans le panier`);

      return {
        produitId: product._id,
        nomProduit: product.nom,
        quantite: item.quantity,
        prixUnitaire: item.unitPrice || product.prix,
        sousTotal: (item.unitPrice || product.prix) * item.quantity,
      };
    });

    // 3. Calculer montantTotal côté serveur (sécurité)
    const montantCalcule = lignes.reduce((sum, l) => sum + l.sousTotal, 0);
    const fraisLivraison = montantCalcule >= 500 ? 0 : 30;
    const montantFinal = montantCalcule + fraisLivraison;

    // 4. Créer la commande
    const commande = await Commande.create({
      clientId,
      nomClient,
      emailClient,
      telephone,
      adresseLivraison,
      lignes,
      montantTotal: montantFinal,
      modePaiement: modePaiement || "COD",
      statut: "en_attente",
    });

    // 5. Décrémenter le stock de chaque produit
    await Promise.all(
      cart.items.map((item) =>
        Produit.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    // 6. Marquer le panier comme "completed"
    cart.status = "completed";
    await cart.save();

    return commande;
  },

  // ── Toutes les commandes (admin) ──────────────────────────
  getToutesCommandes: async () => {
    return Commande.find()
      .sort({ createdAt: -1 })
      .populate("clientId", "nom prenom email");
  },

  // ── Une commande par ID ───────────────────────────────────
  getCommandeById: async (id) => {
    return Commande.findById(id).populate("clientId", "nom prenom email");
  },

  // ── Commandes d'un client ─────────────────────────────────
  getCommandesByClient: async (clientId) => {
    return Commande.find({ clientId }).sort({ createdAt: -1 });
  },

  // ── Mettre à jour le statut ───────────────────────────────
  updateStatutCommande: async (id, statut) => {
    const statutsValides = ["en_attente", "validee", "preparee", "livree", "annulee"];
    if (!statutsValides.includes(statut)) {
      throw new Error(`Statut invalide: ${statut}`);
    }
    return Commande.findByIdAndUpdate(id, { statut }, { new: true });
  },
};

export default commandeService;