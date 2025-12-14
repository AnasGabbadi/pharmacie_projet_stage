import Produit from "../models/Produit.model.js";

export const verifierOrdonnance = async (req, res, next) => {
  const { produitId } = req.body;
  const produit = await Produit.findById(produitId);
  if (!produit) {
    return res.status(404).json({ message: "Produit introuvable" });
  }
  if (produit.necessiteOrdonnance) {
    return res.status(403).json({ message: "Ce produit nécessite une ordonnance. Impossible de l'acheter." });
  }
  next();
};
