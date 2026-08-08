import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques
router.post("/register", authController.register);
router.post("/login", authController.login);

// Routes protégées (profil)
router.get("/me", authMiddleware, authController.getProfile);
router.put("/me", authMiddleware, authController.updateProfile);
router.put("/password", authMiddleware, authController.updatePassword);

export default router;