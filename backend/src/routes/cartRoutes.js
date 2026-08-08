import express from "express";
import cartController from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ IMPORT
import requireRole from "../middleware/roleAuth.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    return authMiddleware(req, res, next);
  }
  next();
};

router.get("/", optionalAuth, cartController.getCart);
router.post("/items", optionalAuth, cartController.addItem);
router.put("/items/:productId", optionalAuth, cartController.updateItem);
router.delete("/items/:productId", optionalAuth, cartController.deleteItem);
router.delete("/", optionalAuth, cartController.clearCart);

router.post("/checkout", requireRole(['client']), cartController.checkout);

export default router;