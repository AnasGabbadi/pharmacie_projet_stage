import { useEffect, useState } from "react";
import {
  Box, Stack, Typography, IconButton, Paper,
  CircularProgress, Alert, Button, Divider, Chip,
} from "@mui/material";
import { Add, Remove, Delete, ShoppingBag, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../../hooks/useCart";

function PanierCrud() {
  const navigate = useNavigate();
  const { cart, loading, error, updateItem, removeItem, clearCart } = useCart();

  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});
  const [alert, setAlert] = useState(null);

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount ||
    items.reduce((s, i) => s + (i.unitPrice || 0) * (i.quantity || 0), 0);
  const itemCount = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const fraisLivraison = totalAmount >= 500 ? 0 : 30;
  const totalFinal = totalAmount + fraisLivraison;

  const showAlert = (message, severity = "success") => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    setUpdatingItems((p) => ({ ...p, [productId]: true }));
    const result = await updateItem(productId, newQty);
    if (!result.success) showAlert(result.message || "Erreur mise à jour", "error");
    setUpdatingItems((p) => ({ ...p, [productId]: false }));
  };

  const handleRemove = async (productId) => {
    setRemovingItems((p) => ({ ...p, [productId]: true }));
    const result = await removeItem(productId);
    if (result.success) showAlert("Produit retiré du panier");
    else {
      showAlert(result.message || "Erreur suppression", "error");
      setRemovingItems((p) => ({ ...p, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Vider tout le panier ?")) return;
    const result = await clearCart();
    if (result.success) showAlert("Panier vidé");
    else showAlert(result.message || "Erreur", "error");
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300, flexDirection: "column", gap: 2 }}>
        <CircularProgress sx={{ color: "#3E5F44" }} />
        <Typography color="text.secondary">Chargement du panier...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center"
        sx={{ padding: { xs: "12px 16px", sm: "16px 24px" } }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontSize: { xs: "1.2rem", sm: "1.8rem" } }}>
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Panier / </span>
          Mon panier ({itemCount} article{itemCount > 1 ? "s" : ""})
        </Typography>
        {items.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleClearCart}
            startIcon={<Delete />}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Tout vider
          </Button>
        )}
      </Stack>

      {/* ── Alert ── */}
      {alert && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Alert severity={alert.severity} onClose={() => setAlert(null)} sx={{ borderRadius: 2 }}>
            {alert.message}
          </Alert>
        </Box>
      )}

      {/* ── Contenu ── */}
      <Box sx={{ flexGrow: 1, px: { xs: 1, sm: 2, md: 3 }, pb: 3, overflowY: "auto" }}>

        {/* Panier vide */}
        {items.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 2 }}>
            <ShoppingBag sx={{ fontSize: 100, color: "#e0e0e0" }} />
            <Typography variant="h6" color="text.secondary">Votre panier est vide</Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Retournez sur la boutique pour ajouter des produits
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}
              sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, textTransform: "none", borderRadius: 2, mt: 1 }}>
              Voir les produits
            </Button>
          </Box>
        ) : (
          <Stack direction={{ xs: "column", lg: "row" }} gap={3} alignItems="flex-start">

            {/* ── Liste produits ── */}
            <Box flex={1}>
              <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8e8e8", backgroundColor: "white", overflow: "hidden" }}>
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
                      <Box sx={{ p: 2.5, display: "flex", gap: 2.5, alignItems: "center", opacity: isRemoving ? 0.4 : 1, transition: "opacity 0.3s" }}>

                        {/* Image */}
                        <Box sx={{ width: 75, height: 75, borderRadius: 2, overflow: "hidden", backgroundColor: "#f5f5f5", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", border: "1px solid #e8e8e8" }}>
                          {image
                            ? <Box component="img" src={image} alt={nom} sx={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                            : "📦"
                          }
                        </Box>

                        {/* Infos */}
                        <Box flex={1} minWidth={0}>
                          <Typography fontWeight={600} noWrap mb={0.5}>{nom}</Typography>
                          <Typography variant="body2" color="text.secondary" mb={1.5}>
                            {prix.toLocaleString()} DH / unité
                          </Typography>

                          {/* Contrôle quantité */}
                          <Stack direction="row" alignItems="center" gap={1}>
                            <IconButton size="small" onClick={() => handleQuantityChange(productId, qty - 1)}
                              disabled={qty <= 1 || isUpdating || isRemoving}
                              sx={{ border: "1px solid #e0e0e0", width: 28, height: 28, backgroundColor: "#fafafa" }}>
                              <Remove sx={{ fontSize: 16 }} />
                            </IconButton>

                            <Box sx={{ minWidth: 40, height: 28, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e0e0e0", borderRadius: 1, backgroundColor: "white", px: 1 }}>
                              {isUpdating
                                ? <CircularProgress size={12} sx={{ color: "#3E5F44" }} />
                                : <Typography fontWeight={700} fontSize="0.85rem">{qty}</Typography>
                              }
                            </Box>

                            <IconButton size="small" onClick={() => handleQuantityChange(productId, qty + 1)}
                              disabled={isUpdating || isRemoving}
                              sx={{ border: "1px solid #e0e0e0", width: 28, height: 28, backgroundColor: "#fafafa" }}>
                              <Add sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Stack>
                        </Box>

                        {/* Prix + supprimer */}
                        <Stack alignItems="flex-end" gap={1.5}>
                          <Typography fontWeight={700} color="#3E5F44">
                            {(prix * qty).toLocaleString()} DH
                          </Typography>
                          <IconButton size="small" onClick={() => handleRemove(productId)} disabled={isRemoving}
                            sx={{ color: "#e74c3c", "&:hover": { backgroundColor: "#fdecea" } }}>
                            {isRemoving ? <CircularProgress size={16} color="error" /> : <Delete fontSize="small" />}
                          </IconButton>
                        </Stack>
                      </Box>
                      {index < items.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Paper>
            </Box>

            {/* ── Récapitulatif ── */}
            <Box sx={{ width: { xs: "100%", lg: 300 }, flexShrink: 0 }}>
              <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #e8e8e8", p: 3, backgroundColor: "white", position: "sticky", top: 16 }}>
                <Typography variant="h6" fontWeight={700} mb={2.5}>Récapitulatif</Typography>

                <Stack gap={1.5} mb={2.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Sous-total ({itemCount} article{itemCount > 1 ? "s" : ""})
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>{totalAmount.toLocaleString()} DH</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Livraison</Typography>
                    {fraisLivraison === 0
                      ? <Typography variant="body2" fontWeight={500} color="#3E5F44">Gratuit 🎉</Typography>
                      : <Typography variant="body2" fontWeight={500}>{fraisLivraison} DH</Typography>
                    }
                  </Stack>
                  {fraisLivraison > 0 && (
                    <Box sx={{ backgroundColor: "#fff8e1", borderRadius: 1.5, p: 1, border: "1px solid #ffe082" }}>
                      <Typography variant="caption" color="#e65100">
                        💡 Plus que <strong>{(500 - totalAmount).toLocaleString()} DH</strong> pour la livraison gratuite
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ mb: 2.5 }} />

                <Stack direction="row" justifyContent="space-between" mb={3}>
                  <Typography fontWeight={700}>Total</Typography>
                  <Typography fontWeight={700} color="#3E5F44" fontSize="1.2rem">
                    {totalFinal.toLocaleString()} DH
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/panier")}
                  sx={{
                    backgroundColor: "#3E5F44",
                    "&:hover": { backgroundColor: "#2f4734" },
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(62,95,68,0.3)",
                  }}
                >
                  Passer commande
                </Button>

                <Chip
                  label={totalAmount >= 500 ? "🚚 Livraison offerte !" : "🔒 Paiement sécurisé"}
                  size="small"
                  sx={{ mt: 2, width: "100%", backgroundColor: "#e8f5e9", color: "#3E5F44", fontWeight: 500 }}
                />
              </Paper>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default PanierCrud;