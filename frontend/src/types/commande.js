/**
 * @typedef {Object} LigneCommande
 * @property {string} produitId
 * @property {string} nomProduit
 * @property {number} prixUnitaire
 * @property {number} quantite
 */

/**
 * @typedef {Object} Commande
 * @property {string} id
 * @property {string} nomClient
 * @property {string} telephone
 * @property {string} adresseLivraison
 * @property {Array<LigneCommande>} lignes
 * @property {number} montantTotal
 * @property {"en_attente" | "validee" | "preparee" | "livree" | "annulee"} statut
 * @property {"COD"} modePaiement
 * @property {string} dateCommande
 * @property {string} createdAt
 * @property {string} updatedAt
 */
