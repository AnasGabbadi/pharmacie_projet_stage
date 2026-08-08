import {
  Menu,
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close, ShoppingBag } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import cartApi from "../../api/cart";

function CartMenu({ anchorEl, open, onClose }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    if (!open) return;
    try {
      setLoading(true);
      setError(null);

      const guestId = localStorage.getItem('guestCartId'); 
      const response = await cartApi.getCart(token, guestId);

      if (response.success) {
        setCartItems(response.data?.items || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError("Erreur chargement panier");
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [open]);

  const total = cartItems.reduce((sum, item) => {
    const prix = item.unitPrice || item.product?.prix || 0;
    const quantite = item.quantity || item.quantite || 0;
    return sum + (prix * quantite);
  }, 0);

  const handleGoToCart = () => {
    navigate("/panier");
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{
        sx: {
          width: 380,
          maxHeight: 500,
          mt: 1,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Mon Panier ({cartItems.length})
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress size={24} sx={{ color: "#3E5F44" }} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Chargement...
            </Typography>
          </Box>
        ) : error ? (
          <Box textAlign="center" py={4} color="error.main">
            <Typography variant="body2">{error}</Typography>
          </Box>
        ) : cartItems.length === 0 ? (
          <Box textAlign="center" py={4}>
            <ShoppingBag sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography color="text.secondary" variant="h6" mb={1}>
              Votre panier est vide
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Ajoutez des produits pour commencer vos achats
            </Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={2} sx={{ maxHeight: 300, overflowY: "auto" }}>
              {cartItems.map((item, index) => {
                const nom = item.product?.nom || item.nom || "Produit inconnu";
                const prix = item.unitPrice || item.product?.prix || 0;
                const image = item.product?.image || item.image || "/api/placeholder/60/60";
                const quantite = item.quantity || item.quantite || 1;

                return (
                  <Stack key={item._id || index} direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={image}
                      alt={nom}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                        backgroundColor: "#f5f5f5",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/60/60";
                      }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        noWrap 
                        sx={{ maxWidth: 140, mb: 0.5 }}
                      >
                        {nom}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ fontSize: "0.75rem", display: "block" }}
                      >
                        {quantite} × {prix.toLocaleString()} DH
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      color="#3E5F44"
                      sx={{ minWidth: 70, textAlign: "right" }}
                    >
                      {(prix * quantite).toLocaleString()} DH
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#3E5F44">
                {total.toLocaleString()} DH
              </Typography>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGoToCart}
              disabled={cartItems.length === 0}
              sx={{
                backgroundColor: "#3E5F44",
                "&:hover": { backgroundColor: "#2f4734" },
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(62, 95, 68, 0.3)",
              }}
            >
              Voir le panier ({cartItems.length})
            </Button>
          </>
        )}
      </Box>
    </Menu>
  );
}

export default CartMenu;