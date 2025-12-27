import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", utilisateurController.register);
router.post("/login", utilisateurController.login);

// ✅ Routes protégées (profil)
router.get("/profil", authMiddleware, utilisateurController.getProfil);
router.put("/profil", authMiddleware, utilisateurController.updateProfil);
router.put("/password", authMiddleware, utilisateurController.updatePassword);

export default router;