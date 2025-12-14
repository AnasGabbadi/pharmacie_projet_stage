import express from "express";
import categorieController from "../controllers/categorieController.js";

const router = express.Router();

router.get("/", categorieController.getCategories);
router.get("/:id", categorieController.getCategorieById);
router.post("/", categorieController.createCategorie);
router.put("/:id", categorieController.updateCategorie);
router.delete("/:id", categorieController.deleteCategorie);

export default router;