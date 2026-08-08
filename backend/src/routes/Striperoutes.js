import express from "express";
import stripeService from "../services/stripeService.js";
import authMiddleware from "../middleware/authMiddleware.js";
import requireRole from "../middleware/roleAuth.js";

const router = express.Router();

// ── POST /api/stripe/create-payment-intent ────────────────
router.post(
  "/create-payment-intent",
  authMiddleware,
  requireRole(["client"]),
  async (req, res) => {
    try {
      const { commandeId } = req.body;

      if (!commandeId) {
        return res.status(400).json({ success: false, message: "commandeId requis" });
      }

      const result = await stripeService.createPaymentIntent(
        commandeId,
        req.user.id
      );

      res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error("❌ create-payment-intent:", err.message);
      res.status(400).json({ success: false, message: err.message });
    }
  }
);

// ── POST /api/stripe/webhook ──────────────────────────────
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // ← raw body requis par Stripe
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      return res.status(400).json({ message: "Signature manquante" });
    }

    try {
      const result = await stripeService.handleWebhook(req.body, signature);
      res.status(200).json(result);
    } catch (err) {
      console.error("❌ Webhook error:", err.message);
      res.status(400).json({ message: err.message });
    }
  }
);

export default router;