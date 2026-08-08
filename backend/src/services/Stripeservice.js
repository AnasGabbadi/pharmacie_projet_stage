// ══════════════════════════════════════════════════════════
// backend/services/stripeService.js
// ══════════════════════════════════════════════════════════
import Stripe from "stripe";
import Commande from "../models/Commande.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeService = {

  // ── Créer un PaymentIntent pour une commande ──────────────
  createPaymentIntent: async (commandeId, clientId) => {
    const commande = await Commande.findById(commandeId);

    if (!commande) {
      throw new Error("Commande introuvable");
    }
    if (commande.clientId.toString() !== clientId.toString()) {
      throw new Error("Accès non autorisé");
    }
    if (commande.modePaiement !== "carte") {
      throw new Error("Cette commande n'est pas en paiement par carte");
    }
    if (commande.statut === "validee") {
      throw new Error("Cette commande est déjà payée");
    }
    if (commande.statut === "annulee") {
      throw new Error("Cette commande est annulée");
    }

    // Stripe travaille en centimes
    const montantCentimes = Math.round(commande.montantTotal * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: montantCentimes,
      currency: "mad", // Dirham marocain — ou "eur" selon votre config Stripe
      metadata: {
        commandeId: commandeId.toString(),
        clientId:   clientId.toString(),
        nomClient:  commande.nomClient,
      },
      description: `Commande ParaVital #${commandeId.toString().slice(-8).toUpperCase()}`,
    });

    // Sauvegarder le paymentIntentId sur la commande
    commande.paymentIntentId = paymentIntent.id;
    await commande.save();

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      montant: commande.montantTotal,
    };
  },

  // ── Webhook Stripe → mise à jour statut automatique ───────
  handleWebhook: async (rawBody, signature) => {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new Error(`Webhook signature invalide: ${err.message}`);
    }

    console.log(`📦 Stripe event: ${event.type}`);

    switch (event.type) {

      // ✅ Paiement réussi → commande validée
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const commandeId    = paymentIntent.metadata?.commandeId;

        if (commandeId) {
          const commande = await Commande.findById(commandeId);
          if (commande && commande.statut !== "validee") {
            commande.statut         = "validee";
            commande.datePaiement   = new Date();
            commande.paymentIntentId = paymentIntent.id;
            await commande.save();
            console.log(`✅ Commande ${commandeId} → validee`);
          }
        }
        break;
      }

      // ❌ Paiement échoué → reste en_attente_paiement
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const commandeId    = paymentIntent.metadata?.commandeId;
        console.warn(`⚠️ Paiement échoué pour commande ${commandeId}`);
        // On ne change pas le statut — le client peut réessayer
        break;
      }

      default:
        console.log(`ℹ️ Event non géré: ${event.type}`);
    }

    return { received: true };
  },
};

export default stripeService;