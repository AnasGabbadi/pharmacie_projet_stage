import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";

const router = express.Router();

router.post("/register", utilisateurController.register);
router.post("/login", utilisateurController.login);

export default router;