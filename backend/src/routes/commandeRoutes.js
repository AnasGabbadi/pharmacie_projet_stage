import express from "express";
import commandeController from "../controllers/commandeController.js";

const router = express.Router();

router.post("/", commandeController.createCommande);
router.get("/admin", commandeController.getToutesCommandes);
router.get("/admin/:id", commandeController.getCommandeById);
router.patch("/admin/:id/statut", commandeController.updateStatutCommande);

export default router;
