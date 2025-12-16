import jwt from "jsonwebtoken";
import Utilisateur from "../models/Utilisateur.model.js";

const authMiddleware = async (req, res, next) => {
    try {
    const authorizationHeader = req.get("authorization");

    if (!authorizationHeader) {
        return res.status(401).json({ message: "Authorization header manquant" });
    }

    const parts = authorizationHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Format du token invalide" });
    }

    const token = parts[1];

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }

    // Payload attendu : { id, role, email }
    const user = await Utilisateur.findById(payload.id);
    if (!user) {
        return res.status(401).json({ message: "Utilisateur non valide" });
    }

    req.user = {
        id: user._id,
        role: user.role,
        email: user.email,
        nom: user.nom,
    };

    next();
    } catch (error) {
    console.error("Erreur authMiddleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default authMiddleware;