import express from "express";
import categorieController from "../controllers/categorieController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleAuth.js";

const router = express.Router();

router.get("/", categorieController.getCategories);
router.get("/:id", authMiddleware, requireRole(['admin']), categorieController.getCategorieById);
router.post("/", authMiddleware, requireRole(['admin']), categorieController.createCategorie);
router.put("/:id", authMiddleware, requireRole(['admin']), categorieController.updateCategorie);
router.delete("/:id", authMiddleware, requireRole(['admin']), categorieController.deleteCategorie);

export default router;