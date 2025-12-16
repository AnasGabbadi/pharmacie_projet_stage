import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminOnly.js";

const router = express.Router();

router.post("/register", authMiddleware, adminOnly, utilisateurController.register);
router.post("/login", adminOnly, utilisateurController.login);

export default router;