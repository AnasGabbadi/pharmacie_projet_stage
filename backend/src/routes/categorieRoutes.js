import express from "express";
import categorieController from "../controllers/categorieController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, categorieController.getCategories);
router.get("/:id", authMiddleware, adminOnly, categorieController.getCategorieById);
router.post("/", authMiddleware, adminOnly, categorieController.createCategorie);
router.put("/:id", authMiddleware, adminOnly, categorieController.updateCategorie);
router.delete("/:id", authMiddleware, adminOnly, categorieController.deleteCategorie);

export default router;