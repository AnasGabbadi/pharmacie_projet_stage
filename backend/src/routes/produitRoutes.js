// routes/produitRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

import produitController from "../controllers/produitController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

// ---------- CONFIG UPLOAD IMAGE ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "storage/public/produit");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ---------- ROUTES PUBLICATIONS PRODUIT ----------

// LISTE / DETAILS (pas besoin d'upload ici)
router.get("/", authMiddleware, adminOnly, produitController.getProduits);
router.get("/:id", authMiddleware, adminOnly, produitController.getProduitById);

// CREATE avec FormData + image
router.post(
  "/",
  authMiddleware,
  adminOnly,
  upload.single("image"),          // 🔹 parse FormData + image
  async (req, res, next) => {
    try {
      // on mappe les champs attendus par ton modèle
      const { nom, description, prix, stock, categorieId, actif } = req.body;

      let imageUrl;
      if (req.file) {
        const baseUrl =
          process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        imageUrl = `${baseUrl}/public/produit/${req.file.filename}`;
      }

      // on reconstruit req.body pour le controller/service
      req.body = {
        nom,
        description,
        prix,
        stock,
        categorieId: categorieId || null,
        imageUrl,
        actif:
          actif !== undefined ? actif === "true" || actif === true : true,
      };

      return produitController.createProduit(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE avec FormData + image
router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { nom, description, prix, stock, categorieId, actif } = req.body;

      let imageUrl;
      if (req.file) {
        const baseUrl =
          process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
        imageUrl = `${baseUrl}/public/produit/${req.file.filename}`;
      }

      const updateData = {
        nom,
        description,
        prix,
        stock,
        categorieId: categorieId || null,
        actif:
          actif !== undefined ? actif === "true" || actif === true : undefined,
      };

      if (imageUrl) updateData.imageUrl = imageUrl;

      req.body = updateData;

      return produitController.updateProduit(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE (pas d'upload)
router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  produitController.deleteProduit
);

export default router;