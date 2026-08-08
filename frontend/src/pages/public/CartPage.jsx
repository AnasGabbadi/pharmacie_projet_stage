import { useState } from "react";
import {
  Box, Container, Typography, Button, IconButton, Divider,
  TextField, CircularProgress, Alert, Snackbar, Paper, Stack,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  RadioGroup, FormControlLabel, Radio, FormControl,
} from "@mui/material";
import {
  Add, Remove, Delete, ShoppingBag, ArrowBack,
  LocalShipping, Security, CheckCircle, CreditCard, LocalAtm,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";

function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, updateItem, removeItem, clearCart, checkout } = useCart();
  const { token, user } = useAuth();

  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [form, setForm] = useState({
    rue: "",
    ville: "",
    codePostal: "",
    pays: "Maroc",
    telephone: user?.telephone || "",
    modePaiement: "COD",
  });
  const [formErrors, setFormErrors] = useState({});

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || items.reduce((s, i) => s + (i.unitPrice || 0) * (i.quantity || 0), 0);
  const itemCount = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const fraisLivraison = totalAmount >= 500 ? 0 : 30;
  const totalFinal = totalAmount + fraisLivraison;

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const setField = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setFormErrors((p) => ({ ...p, [field]: undefined }));
  };

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdatingItems((p) => ({ ...p, [productId]: true }));
    const result = await updateItem(productId, newQty);
    if (!result.success) showSnackbar(result.message || "Erreur mise à jour", "error");
    setUpdatingItems((p) => ({ ...p, [productId]: false }));
  };

  const handleRemove = async (productId) => {
    setRemovingItems((p) => ({ ...p, [productId]: true }));
    const result = await removeItem(productId);
    if (result.success) showSnackbar("Produit retiré du panier");
    else {
      showSnackbar(result.message || "Erreur suppression", "error");
      setRemovingItems((p) => ({ ...p, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) showSnackbar("Panier vidé");
    else showSnackbar(result.message || "Erreur", "error");
  };

  // ── Ouvrir checkout avec validations préalables ───────────
  const handleOpenCheckout = () => {
    // 1. Panier non vide
    if (items.length === 0) {
      showSnackbar("Votre panier est vide", "error");
      return;
    }
    // 2. Client connecté
    if (!token) {
      showSnackbar("Connectez-vous pour passer commande", "warning");
      navigate("/login");
      return;
    }
    setCheckoutOpen(true);
  };

  // ── Validation formulaire checkout ────────────────────────
  const validateForm = () => {
    const errors = {};
    if (!form.rue.trim())
      errors.rue = "Rue obligatoire";
    if (!form.ville.trim())
      errors.ville = "Ville obligatoire";
    if (!form.telephone.trim())
      errors.telephone = "Téléphone obligatoire";
    else if (!/^(\+212|0)[5-7][0-9]{8}$/.test(form.telephone.replace(/\s/g, "")))
      errors.telephone = "Format invalide (ex: 0661234567 ou +212661234567)";
    if (!form.modePaiement)
      errors.modePaiement = "Choisissez un mode de paiement";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;
    setCheckoutLoading(true);

    const payload = {
      adresseLivraison: {
        rue: form.rue,
        ville: form.ville,
        codePostal: form.codePostal,
        pays: form.pays,
      },
      telephone: form.telephone,
      modePaiement: form.modePaiement,
      montantTotal: totalFinal,
    };

    const result = await checkout(payload);
    setCheckoutLoading(false);

    if (result.success) {
      setCheckoutOpen(false);
      showSnackbar("🎉 Commande passée avec succès !", "success");
      setTimeout(() => navigate("/client"), 2500);
    } else {
      showSnackbar(result.message || "Erreur lors de la commande", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
        <CircularProgress sx={{ color: "#3E5F44" }} size={40} />
        <Typography color="text.secondary">Chargement du panier...</Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
        <ShoppingBag sx={{ fontSize: 100, color: "#e0e0e0", mb: 3 }} />
        <Typography variant="h4" fontWeight={700} color="#2d3436" mb={1}>Votre panier est vide</Typography>
        <Typography color="text.secondary" mb={4}>Découvrez nos produits et commencez vos achats</Typography>
        <Button variant="contained" size="large" onClick={() => navigate("/")}
          sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, px: 4, py: 1.5, textTransform: "none", fontSize: "1rem", fontWeight: 600, borderRadius: 2 }}>
          Voir les produits
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">

        {/* En-tête */}
        <Stack direction="row" alignItems="center" gap={2} mb={4}>
          <IconButton onClick={() => navigate(-1)} sx={{ border: "1px solid #e0e0e0", backgroundColor: "white" }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#2d3436">Mon Panier</Typography>
            <Typography color="text.secondary" variant="body2">{itemCount} article{itemCount > 1 ? "s" : ""}</Typography>
          </Box>
          <Button variant="outlined" color="error" size="small" onClick={handleClearCart}
            sx={{ ml: "auto", textTransform: "none", borderRadius: 2 }}>
            Vider le panier
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} gap={3} alignItems="flex-start">

          {/* Liste produits */}
          <Box flex={1}>
            <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #e8e8e8" }}>
              {items.map((item, index) => {
                const product = item.product || {};
                const nom = product.nom || "Produit";
                const image = product.image || null;
                const prix = item.unitPrice || product.prix || 0;
                const qty = item.quantity || 1;
                const productId = product._id || item.product;
                const isUpdating = updatingItems[productId];
                const isRemoving = removingItems[productId];

                return (
                  <Box key={item._id || index}>
                    <Box sx={{ p: 3, display: "flex", gap: 3, alignItems: "center", backgroundColor: "white", opacity: isRemoving ? 0.4 : 1, transition: "opacity 0.3s" }}>
                      <Box sx={{ width: 90, height: 90, borderRadius: 2, overflow: "hidden", backgroundColor: "#f5f5f5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                        {image ? <Box component="img" src={image} alt={nom} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} /> : "📦"}
                      </Box>
                      <Box flex={1} minWidth={0}>
                        <Typography fontWeight={600} fontSize="1rem" noWrap mb={0.5}>{nom}</Typography>
                        <Typography variant="body2" color="text.secondary" mb={1.5}>{prix.toLocaleString()} DH / unité</Typography>
                        <Stack direction="row" alignItems="center" gap={1}>
                          <IconButton size="small" onClick={() => handleQuantityChange(productId, qty - 1)} disabled={qty <= 1 || isUpdating || isRemoving} sx={{ border: "1px solid #e0e0e0", width: 32, height: 32, backgroundColor: "#fafafa" }}>
                            <Remove fontSize="small" />
                          </IconButton>
                          <Box sx={{ minWidth: 44, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "white", px: 1 }}>
                            {isUpdating ? <CircularProgress size={14} sx={{ color: "#3E5F44" }} /> : <Typography fontWeight={700} fontSize="0.9rem">{qty}</Typography>}
                          </Box>
                          <IconButton size="small" onClick={() => handleQuantityChange(productId, qty + 1)} disabled={isUpdating || isRemoving} sx={{ border: "1px solid #e0e0e0", width: 32, height: 32, backgroundColor: "#fafafa" }}>
                            <Add fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                      <Stack alignItems="flex-end" gap={1.5}>
                        <Typography fontWeight={700} fontSize="1.1rem" color="#3E5F44">{(prix * qty).toLocaleString()} DH</Typography>
                        <IconButton size="small" onClick={() => handleRemove(productId)} disabled={isRemoving} sx={{ color: "#e74c3c", "&:hover": { backgroundColor: "#fdecea" } }}>
                          {isRemoving ? <CircularProgress size={18} color="error" /> : <Delete fontSize="small" />}
                        </IconButton>
                      </Stack>
                    </Box>
                    {index < items.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </Paper>
            <Stack direction="row" gap={2} mt={3} flexWrap="wrap">
              <Chip icon={<LocalShipping sx={{ color: "#3E5F44 !important" }} />} label={totalAmount >= 500 ? "Livraison offerte !" : "Livraison gratuite dès 500 DH"} sx={{ backgroundColor: "#e8f5e9", color: "#3E5F44", fontWeight: 500 }} />
              <Chip icon={<Security sx={{ color: "#3E5F44 !important" }} />} label="Paiement sécurisé" sx={{ backgroundColor: "#e8f5e9", color: "#3E5F44", fontWeight: 500 }} />
            </Stack>
          </Box>

          {/* Récapitulatif */}
          <Box sx={{ width: { xs: "100%", md: 340 }, flexShrink: 0 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8e8e8", p: 3, position: "sticky", top: 90, backgroundColor: "white" }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Récapitulatif</Typography>
              <Stack gap={2} mb={3}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})</Typography>
                  <Typography fontWeight={500}>{totalAmount.toLocaleString()} DH</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Frais de livraison</Typography>
                  {fraisLivraison === 0
                    ? <Typography fontWeight={500} color="#3E5F44">Gratuit 🎉</Typography>
                    : <Typography fontWeight={500}>{fraisLivraison} DH</Typography>}
                </Stack>
                {fraisLivraison > 0 && (
                  <Box sx={{ backgroundColor: "#fff8e1", borderRadius: 1.5, p: 1.5, border: "1px solid #ffe082" }}>
                    <Typography variant="caption" color="#e65100">
                      💡 Ajoutez encore <strong>{(500 - totalAmount).toLocaleString()} DH</strong> pour la livraison gratuite
                    </Typography>
                  </Box>
                )}
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h5" fontWeight={700} color="#3E5F44">{totalFinal.toLocaleString()} DH</Typography>
              </Stack>
              <Button variant="contained" fullWidth size="large" onClick={handleOpenCheckout}
                sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, py: 1.8, textTransform: "none", fontSize: "1rem", fontWeight: 700, borderRadius: 2, boxShadow: "0 4px 16px rgba(62,95,68,0.35)" }}>
                Commander maintenant
              </Button>
              {!token && (
                <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1.5}>
                  Vous devrez vous connecter pour finaliser votre commande
                </Typography>
              )}
              <Button variant="text" fullWidth onClick={() => navigate("/")} sx={{ mt: 1, color: "#3E5F44", textTransform: "none", fontWeight: 500 }}>
                ← Continuer mes achats
              </Button>
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Dialog Checkout */}
      <Dialog open={checkoutOpen} onClose={() => !checkoutLoading && setCheckoutOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 0 }}>Finaliser la commande</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>

          <Typography variant="subtitle2" fontWeight={700} color="#3E5F44" mb={1.5} mt={1}>📍 Adresse de livraison</Typography>
          <Stack gap={2} mb={3}>
            <TextField label="Rue / Adresse complète *" value={form.rue} onChange={(e) => setField("rue", e.target.value)} error={!!formErrors.rue} helperText={formErrors.rue} fullWidth placeholder="Ex: 12 Rue Mohammed V, Apt 3" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <Stack direction="row" gap={2}>
              <TextField label="Ville *" value={form.ville} onChange={(e) => setField("ville", e.target.value)} error={!!formErrors.ville} helperText={formErrors.ville} fullWidth placeholder="Ex: Casablanca" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              <TextField label="Code postal" value={form.codePostal} onChange={(e) => setField("codePostal", e.target.value)} fullWidth placeholder="Ex: 20000" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            </Stack>
            <TextField label="Pays" value={form.pays} onChange={(e) => setField("pays", e.target.value)} fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          </Stack>

          <Typography variant="subtitle2" fontWeight={700} color="#3E5F44" mb={1.5}>📞 Contact</Typography>
          <TextField
            label="Téléphone *"
            value={form.telephone}
            onChange={(e) => setField("telephone", e.target.value)}
            error={!!formErrors.telephone}
            helperText={formErrors.telephone || "Format: 0661234567 ou +212661234567"}
            fullWidth
            placeholder="Ex: 0661234567"
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Typography variant="subtitle2" fontWeight={700} color="#3E5F44" mb={1.5}>💳 Mode de paiement</Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup value={form.modePaiement} onChange={(e) => setField("modePaiement", e.target.value)}>
              <Paper variant="outlined" onClick={() => setField("modePaiement", "COD")}
                sx={{ p: 2, mb: 1.5, borderRadius: 2, cursor: "pointer", border: form.modePaiement === "COD" ? "2px solid #3E5F44" : "1px solid #e0e0e0", backgroundColor: form.modePaiement === "COD" ? "#f0f7f1" : "white", transition: "all 0.2s" }}>
                <FormControlLabel value="COD" control={<Radio sx={{ color: "#3E5F44", "&.Mui-checked": { color: "#3E5F44" } }} />}
                  label={<Stack direction="row" alignItems="center" gap={1.5}><LocalAtm sx={{ color: "#3E5F44", fontSize: 28 }} /><Box><Typography fontWeight={600} fontSize="0.95rem">Paiement à la livraison</Typography><Typography variant="caption" color="text.secondary">Payez en espèces à la réception</Typography></Box></Stack>}
                  sx={{ m: 0, width: "100%" }} />
              </Paper>
              <Paper variant="outlined" onClick={() => setField("modePaiement", "carte")}
                sx={{ p: 2, borderRadius: 2, cursor: "pointer", border: form.modePaiement === "carte" ? "2px solid #3E5F44" : "1px solid #e0e0e0", backgroundColor: form.modePaiement === "carte" ? "#f0f7f1" : "white", transition: "all 0.2s" }}>
                <FormControlLabel value="carte" control={<Radio sx={{ color: "#3E5F44", "&.Mui-checked": { color: "#3E5F44" } }} />}
                  label={<Stack direction="row" alignItems="center" gap={1.5}><CreditCard sx={{ color: "#3E5F44", fontSize: 28 }} /><Box><Typography fontWeight={600} fontSize="0.95rem">Paiement par carte</Typography><Typography variant="caption" color="text.secondary">Visa, Mastercard — paiement sécurisé</Typography></Box></Stack>}
                  sx={{ m: 0, width: "100%" }} />
              </Paper>
            </RadioGroup>
          </FormControl>

          {/* Récap */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 2, border: "1px solid #e8e8e8" }}>
            <Typography variant="body2" fontWeight={700} mb={1.5}>Récapitulatif</Typography>
            <Stack gap={0.5}>
              {items.map((item) => (
                <Stack key={item._id} direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">{item.product?.nom || "Produit"} × {item.quantity}</Typography>
                  <Typography variant="caption" fontWeight={500}>{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()} DH</Typography>
                </Stack>
              ))}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">Livraison</Typography>
                <Typography variant="caption" fontWeight={500} color={fraisLivraison === 0 ? "#3E5F44" : "inherit"}>
                  {fraisLivraison === 0 ? "Gratuit" : `${fraisLivraison} DH`}
                </Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={700}>Total TTC</Typography>
              <Typography variant="body2" fontWeight={700} color="#3E5F44">{totalFinal.toLocaleString()} DH</Typography>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button onClick={() => setCheckoutOpen(false)} disabled={checkoutLoading} sx={{ textTransform: "none", color: "text.secondary" }}>Annuler</Button>
          <Button variant="contained" onClick={handleCheckout} disabled={checkoutLoading}
            startIcon={checkoutLoading ? <CircularProgress size={18} color="inherit" /> : <CheckCircle />}
            sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, textTransform: "none", fontWeight: 700, px: 3, borderRadius: 2 }}>
            {checkoutLoading ? "Traitement..." : "Confirmer la commande"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default CartPage;