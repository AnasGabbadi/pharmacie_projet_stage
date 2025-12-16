import express from "express";
import produitController from "../controllers/produitController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, produitController.getProduits);
router.get("/:id", authMiddleware, adminOnly, produitController.getProduitById);
router.post("/", authMiddleware, adminOnly, produitController.createProduit);
router.put("/:id", authMiddleware, adminOnly, produitController.updateProduit);
router.delete("/:id", authMiddleware, adminOnly, produitController.deleteProduit);

export default router;