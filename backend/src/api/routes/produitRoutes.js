import express from "express";
import produitController from "../controllers/produitController.js";

const router = express.Router();

router.get("/", produitController.getProduits);
router.get("/:id", produitController.getProduitById);
router.post("/", produitController.createProduit);
router.put("/:id", produitController.updateProduit);
router.delete("/:id", produitController.deleteProduit);

export default router;