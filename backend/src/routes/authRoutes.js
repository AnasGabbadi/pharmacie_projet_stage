import express from "express";
import rateLimit from "express-rate-limit";
import authController from "../controllers/authController.js";
import clientController from "../controllers/clientController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleAuth.js";

const router = express.Router();

// Limite les tentatives de connexion/inscription par IP (protection anti-bruteforce)
// — appliquée uniquement à ces deux routes sensibles, pas globalement.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 tentatives par IP sur la fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Trop de tentatives. Veuillez réessayer dans quelques minutes.",
  },
});

// Routes publiques
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

// Routes protégées (profil)
router.get("/me", authMiddleware, authController.getProfile);
router.put("/me", authMiddleware, authController.updateProfile);
router.put("/password", authMiddleware, authController.updatePassword);

// Adresses du client connecté — réservé au rôle client (Utilisateur/admin n'a
// pas de champ adresses).
router.get("/me/adresses", authMiddleware, requireRole(["client"]), clientController.getAdresses);
router.post("/me/adresses", authMiddleware, requireRole(["client"]), clientController.addAdresse);
router.put("/me/adresses/:addressId", authMiddleware, requireRole(["client"]), clientController.updateAdresse);
router.delete("/me/adresses/:addressId", authMiddleware, requireRole(["client"]), clientController.deleteAdresse);

export default router;