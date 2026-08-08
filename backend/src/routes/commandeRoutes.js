import express from "express";
import commandeController from "../controllers/commandeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleAuth.js";

const router = express.Router();

// ── Client authentifié ──────────────────────────────────────
router.post("/", authMiddleware, requireRole(["client"]), commandeController.checkout);
router.get("/mes-commandes", authMiddleware, requireRole(["client"]), commandeController.getMesCommandes);

// ── Admin ───────────────────────────────────────────────────
router.get("/admin", authMiddleware, requireRole(["admin"]), commandeController.getToutesCommandes);
router.get("/admin/:id", authMiddleware, requireRole(["admin"]), commandeController.getCommandeById);
router.patch("/admin/:id/statut", authMiddleware, requireRole(["admin"]), commandeController.updateStatutCommande);

export default router;