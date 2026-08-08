import jwt from "jsonwebtoken";
import Client from "../models/Client.model.js";
import Utilisateur from "../models/Utilisateur.model.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization"); // ✅ Majuscule

    if (!authorizationHeader) {
      return res.status(401).json({ 
        success: false, 
        message: "Token d'autorisation manquant" 
      });
    }

    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
      return res.status(401).json({ 
        success: false, 
        message: "Format Bearer token invalide" 
      });
    }

    const token = parts[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "ParaVital2026_super_secret_key");
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: "Token invalide ou expiré" 
      });
    }

    // ✅ CHERCHE DANS LES DEUX MODÈLES selon rôle
    let user = null;
    if (payload.role === "client") {
      user = await Client.findById(payload.id).select("nom prenom email telephone role actif adresses");
    } else if (payload.role === "admin") {
      user = await Utilisateur.findById(payload.id).select("nom email role");
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    // ✅ Active seulement pour clients
    if (payload.role === "client" && !user.actif) {
      return res.status(403).json({ 
        success: false, 
        message: "Compte client désactivé" 
      });
    }

    req.user = {
      id: user._id,
      role: payload.role,
      email: user.email,
      nom: user.role === "client" ? `${user.nom} ${user.prenom}` : user.nom,
      ...(user.role === "client" && { telephone: user.telephone })
    };

    next();
  } catch (error) {
    console.error("Erreur authMiddleware:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur serveur d'authentification" 
    });
  }
};

export default authMiddleware;