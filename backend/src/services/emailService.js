// ══════════════════════════════════════════════════════════
// backend/services/emailService.js
// Envoi centralisé des emails transactionnels (Nodemailer / SMTP Gmail).
// L'échec d'un envoi ne doit jamais remonter comme une erreur bloquante :
// sendMail() catche en interne et retourne { success, error } — elle ne
// lève jamais. Les appelants (commandeService, stripeService) entourent
// malgré tout leur appel d'un try/catch dédié, pour garder l'échec de
// l'email visuellement isolé de la logique métier qui le déclenche.
// ══════════════════════════════════════════════════════════
import nodemailer from "nodemailer";

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

if (!EMAIL_USER || !EMAIL_PASSWORD) {
  console.warn(
    "⚠️  EMAIL_USER / EMAIL_PASSWORD manquant(s) dans l'environnement — " +
    "l'envoi d'emails transactionnels est désactivé (le serveur démarre normalement)."
  );
}

// Transporteur créé une seule fois au chargement du module ; reste `null`
// si les credentials sont absents, pour ne jamais tenter d'envoi invalide.
const transporter = (EMAIL_USER && EMAIL_PASSWORD)
  ? nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
    })
  : null;

// ── Envoi générique — ne lève jamais ───────────────────────
const sendMail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.error(`❌ Email non envoyé (transporteur non configuré) — sujet: "${subject}"`);
    return { success: false, error: "Transporteur email non configuré" };
  }

  try {
    await transporter.sendMail({
      from: `"ParaVital" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email envoyé — sujet: "${subject}"`);
    return { success: true };
  } catch (err) {
    console.error(`❌ Erreur envoi email — sujet: "${subject}" — ${err.message}`);
    return { success: false, error: err.message };
  }
};

// ── Gabarits ────────────────────────────────────────────────
const formatMontant = (n) => `${Number(n || 0).toLocaleString("fr-FR")} DH`;
const numeroCommande = (commande) => commande._id.toString().slice(-8).toUpperCase();

const ligneRow = (l) => `
  <tr>
    <td style="padding:8px;border-bottom:1px solid #eee;">${l.nomProduit}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${l.quantite}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatMontant(l.prixUnitaire)}</td>
    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatMontant(l.sousTotal)}</td>
  </tr>
`;

const emailWrapper = (bodyHtml) => `
  <div style="font-family:Arial,sans-serif;color:#2d3436;max-width:600px;margin:0 auto;">
    ${bodyHtml}
    <p style="color:#888;font-size:0.85em;margin-top:24px;">— L'équipe ParaVital</p>
  </div>
`;

// ── Email 1 : accusé de réception (création de commande) ──
const envoyerAccuseReception = async (commande) => {
  const modePaiementLabel = commande.modePaiement === "carte" ? "Paiement par carte" : "Paiement à la livraison";
  const adresse = commande.adresseLivraison || {};
  const numero = numeroCommande(commande);

  const html = emailWrapper(`
    <h2 style="color:#3E5F44;">Merci pour votre commande !</h2>
    <p>Bonjour ${commande.nomClient || ""},</p>
    <p>Nous avons bien reçu votre commande <strong>#${numero}</strong>. Voici son récapitulatif :</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <thead>
        <tr style="background:#f0f7f1;">
          <th style="padding:8px;text-align:left;">Produit</th>
          <th style="padding:8px;text-align:center;">Qté</th>
          <th style="padding:8px;text-align:right;">Prix unitaire</th>
          <th style="padding:8px;text-align:right;">Sous-total</th>
        </tr>
      </thead>
      <tbody>
        ${(commande.lignes || []).map(ligneRow).join("")}
      </tbody>
    </table>
    <p style="text-align:right;font-weight:bold;font-size:1.1em;">Total : ${formatMontant(commande.montantTotal)}</p>
    <p>
      <strong>Adresse de livraison :</strong><br/>
      ${adresse.rue || ""}, ${adresse.ville || ""}${adresse.codePostal ? `, ${adresse.codePostal}` : ""}, ${adresse.pays || "Maroc"}
    </p>
    <p><strong>Mode de paiement :</strong> ${modePaiementLabel}</p>
    <p>Nous vous tiendrons informé(e) de l'avancement de votre commande.</p>
  `);

  return sendMail({
    to: commande.emailClient,
    subject: `Commande #${numero} bien reçue`,
    html,
  });
};

// ── Email 2 : confirmation de paiement / validation ────────
const envoyerConfirmationPaiement = async (commande) => {
  const numero = numeroCommande(commande);

  const html = emailWrapper(`
    <h2 style="color:#3E5F44;">Votre commande est validée ✅</h2>
    <p>Bonjour ${commande.nomClient || ""},</p>
    <p>Bonne nouvelle : votre commande <strong>#${numero}</strong> est validée et va être préparée.</p>
    <p style="text-align:right;font-weight:bold;font-size:1.1em;">Total : ${formatMontant(commande.montantTotal)}</p>
    <p>Nous vous tiendrons informé(e) des prochaines étapes (préparation, livraison).</p>
  `);

  return sendMail({
    to: commande.emailClient,
    subject: `Commande #${numero} validée`,
    html,
  });
};

const emailService = {
  sendMail,
  envoyerAccuseReception,
  envoyerConfirmationPaiement,
};

export default emailService;
