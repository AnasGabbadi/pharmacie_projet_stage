import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Stack, CircularProgress,
  Alert, Divider, Paper, Chip,
} from "@mui/material";
import {
  CreditCard, Lock, CheckCircle, Close,
} from "@mui/icons-material";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ── Charger Stripe avec clé publique ─────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// ── Style Stripe Elements ─────────────────────────────────
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      fontFamily: "inherit",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#e74c3c", iconColor: "#e74c3c" },
  },
};

// ══════════════════════════════════════════════════════════
// Formulaire interne (doit être dans <Elements>)
// ══════════════════════════════════════════════════════════
function CheckoutForm({ commande, clientSecret, onSuccess, onClose }) {
  const stripe   = useStripe();
  const elements = useElements();

  const [processing, setProcessing] = useState(false);
  const [error,      setError]      = useState(null);
  const [cardReady,  setCardReady]  = useState({
    number: false, expiry: false, cvc: false,
  });

  const allReady = Object.values(cardReady).every(Boolean);

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
            billing_details: {
              name:  commande.nomClient,
              email: commande.emailClient,
              phone: commande.telephone,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || "Erreur lors du paiement");
    } finally {
      setProcessing(false);
    }
  };

  // ── Style wrapper pour chaque champ Stripe ────────────────
  const fieldStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "14px 16px",
    backgroundColor: "#fafafa",
    transition: "border-color 0.2s",
    "&:focus-within": { borderColor: "#3E5F44", backgroundColor: "white" },
  };

  return (
    <Stack gap={2.5}>
      {/* Récap commande */}
      <Paper sx={{ p: 2, backgroundColor: "#f0f7f1", borderRadius: 2, border: "1px solid #c8e6c9" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="body2" color="text.secondary">
              Commande #{commande._id?.slice(-8).toUpperCase()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {commande.lignes?.length} article{commande.lignes?.length > 1 ? "s" : ""}
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={800} color="#3E5F44">
            {commande.montantTotal?.toLocaleString()} DH
          </Typography>
        </Stack>
      </Paper>

      {/* Champs carte */}
      <Box>
        <Typography variant="subtitle2" fontWeight={700} color="#3E5F44" mb={1.5}>
          💳 Informations de la carte
        </Typography>

        {/* Numéro de carte */}
        <Box mb={2}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} mb={0.5} display="block">
            Numéro de carte
          </Typography>
          <Box sx={fieldStyle}>
            <CardNumberElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => setCardReady((p) => ({ ...p, number: e.complete }))}
            />
          </Box>
        </Box>

        {/* Expiration + CVC */}
        <Stack direction="row" gap={2}>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} mb={0.5} display="block">
              Expiration
            </Typography>
            <Box sx={fieldStyle}>
              <CardExpiryElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(e) => setCardReady((p) => ({ ...p, expiry: e.complete }))}
              />
            </Box>
          </Box>
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} mb={0.5} display="block">
              CVC
            </Typography>
            <Box sx={fieldStyle}>
              <CardCvcElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={(e) => setCardReady((p) => ({ ...p, cvc: e.complete }))}
              />
            </Box>
          </Box>
        </Stack>
      </Box>

      {/* Carte de test info */}
      <Paper sx={{ p: 1.5, backgroundColor: "#fff8e1", borderRadius: 2, border: "1px solid #ffe082" }}>
        <Typography variant="caption" color="#e65100" fontWeight={600}>
          🧪 Carte de test : 4242 4242 4242 4242 — exp: 12/34 — CVC: 123
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Bouton payer */}
      <Button
        variant="contained"
        fullWidth
        size="large"
        onClick={handleSubmit}
        disabled={!stripe || !allReady || processing}
        startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <Lock />}
        sx={{
          backgroundColor: "#3E5F44",
          "&:hover": { backgroundColor: "#2f4734" },
          "&:disabled": { backgroundColor: "#bdbdbd" },
          py: 1.8, textTransform: "none",
          fontSize: "1rem", fontWeight: 700, borderRadius: 2,
          boxShadow: "0 4px 12px rgba(62,95,68,0.35)",
        }}
      >
        {processing
          ? "Traitement en cours..."
          : `Payer ${commande.montantTotal?.toLocaleString()} DH`
        }
      </Button>

      {/* Badge sécurité */}
      <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
        <Lock sx={{ fontSize: 14, color: "#9e9e9e" }} />
        <Typography variant="caption" color="text.secondary">
          Paiement sécurisé par Stripe — vos données sont chiffrées
        </Typography>
      </Stack>
    </Stack>
  );
}

// ══════════════════════════════════════════════════════════
// Composant principal exporté
// ══════════════════════════════════════════════════════════
function StripePaymentDialog({ open, commande, onClose, onPaymentSuccess }) {
  const token = localStorage.getItem("token");

  const [clientSecret,  setClientSecret]  = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [paid,          setPaid]          = useState(false);

  // ── Créer le PaymentIntent au moment d'ouvrir ─────────────
  useEffect(() => {
    if (!open || !commande?._id) return;

    const createIntent = async () => {
      setLoading(true);
      setError(null);
      setClientSecret(null);
      setPaid(false);

      try {
        const res = await fetch(`${API_BASE}/stripe/create-payment-intent`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commandeId: commande._id }),
        });
        const data = await res.json();

        if (data.success) {
          setClientSecret(data.data.clientSecret);
        } else {
          setError(data.message || "Erreur création paiement");
        }
      } catch {
        setError("Erreur de connexion au serveur");
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [open, commande?._id]);

  const handleSuccess = () => {
    setPaid(true);
    // Attendre 2.5s puis fermer et notifier le parent
    setTimeout(() => {
      onPaymentSuccess?.();
      onClose();
    }, 2500);
  };

  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" } }}
    >
      <DialogTitle sx={{
        background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
        color: "white", fontWeight: 700, textAlign: "center",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <CreditCard />
          <span>Paiement par carte</span>
        </Stack>
        <IconCloseBtn onClose={onClose} loading={loading} />
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>

        {/* ── Succès ── */}
        {paid ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CheckCircle sx={{ fontSize: 80, color: "#3E5F44", mb: 2 }} />
            <Typography variant="h5" fontWeight={700} color="#3E5F44" mb={1}>
              Paiement réussi ! 🎉
            </Typography>
            <Typography color="text.secondary">
              Votre commande est confirmée. Vous allez être redirigé...
            </Typography>
          </Box>

        ) : loading ? (
          /* ── Chargement ── */
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress sx={{ color: "#3E5F44", mb: 2 }} />
            <Typography color="text.secondary">Préparation du paiement...</Typography>
          </Box>

        ) : error ? (
          /* ── Erreur création intent ── */
          <Box sx={{ py: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            <Button fullWidth onClick={onClose} sx={{ mt: 2, textTransform: "none" }}>
              Fermer
            </Button>
          </Box>

        ) : clientSecret ? (
          /* ── Formulaire Stripe ── */
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              commande={commande}
              clientSecret={clientSecret}
              onSuccess={handleSuccess}
              onClose={onClose}
            />
          </Elements>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

// Petit composant bouton fermer
function IconCloseBtn({ onClose, loading }) {
  return (
    <Box
      component="button"
      onClick={onClose}
      disabled={loading}
      sx={{
        background: "none", border: "none", cursor: "pointer",
        color: "white", display: "flex", alignItems: "center",
        opacity: loading ? 0.5 : 1, p: 0,
      }}
    >
      <Close />
    </Box>
  );
}

export default StripePaymentDialog;