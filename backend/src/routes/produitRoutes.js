// routes/produitRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";

import produitController from "../controllers/produitController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleAuth.js";

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

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (req, file, cb) => {
  const extOk = ALLOWED_EXTENSIONS.includes(path.extname(file.originalname).toLowerCase());
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non autorisé. Formats acceptés : JPEG, PNG, WEBP."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
});

// Enveloppe upload.single("image") pour renvoyer une erreur JSON propre
// (fichier rejeté par fileFilter, taille dépassée) au lieu de laisser
// planter la requête sans réponse claire.
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Fichier trop volumineux (taille maximale : 5 Mo)."
          : err.message || "Erreur lors de l'upload du fichier.";
      return res.status(400).json({ success: false, message });
    }
    next();
  });
};

// ---------- ROUTES PUBLICATIONS PRODUIT ----------

// LISTE / DETAILS (pas besoin d'upload ici)
router.get("/", produitController.getProduits);
router.get("/:id", produitController.getProduitById);

// CREATE avec FormData + image
router.post(
  "/",
  authMiddleware,
  requireRole(['admin']),
  uploadImage,          // 🔹 parse FormData + image
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
  requireRole(['admin']),
  uploadImage,
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
  requireRole(['admin']),
  produitController.deleteProduit
);

export default router;