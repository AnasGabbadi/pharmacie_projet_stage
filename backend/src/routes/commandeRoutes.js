import express from "express";
import commandeController from "../controllers/commandeController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// Public
router.post("/", commandeController.createCommande);

// Admin
router.get("/admin", authMiddleware, adminOnly, commandeController.getToutesCommandes);
router.get("/admin/:id", authMiddleware, adminOnly, commandeController.getCommandeById);
router.patch("/admin/:id/statut", authMiddleware, adminOnly, commandeController.updateStatutCommande);


export default router;