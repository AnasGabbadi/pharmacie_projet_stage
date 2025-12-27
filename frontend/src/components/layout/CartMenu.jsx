// src/components/layout/CartMenu.jsx
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { Close, ShoppingBag } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function CartMenu({ anchorEl, open, onClose }) {
  const navigate = useNavigate();

  // Exemple de produits dans le panier
  const cartItems = [
    { id: 1, nom: "Crème hydratante", prix: 450, quantite: 1, image: "/products/creme1.jpg" },
    { id: 2, nom: "Sérum anti-âge", prix: 330, quantite: 2, image: "/products/serum.jpg" },
  ];

  const total = cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);

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
          width: 350,
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

        {cartItems.length === 0 ? (
          <Box textAlign="center" py={4}>
            <ShoppingBag sx={{ fontSize: 60, color: "#ccc", mb: 2 }} />
            <Typography color="text.secondary">Votre panier est vide</Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={2} sx={{ maxHeight: 300, overflowY: "auto" }}>
              {cartItems.map((item) => (
                <Stack key={item.id} direction="row" spacing={2}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.nom}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.nom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.quantite} x {item.prix} DH
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600} color="#3E5F44">
                    {item.prix * item.quantite} DH
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Total
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#3E5F44">
                {total} DH
              </Typography>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGoToCart}
              sx={{
                backgroundColor: "#3E5F44",
                "&:hover": {
                  backgroundColor: "#2f4734",
                },
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              Voir le panier
            </Button>
          </>
        )}
      </Box>
    </Menu>
  );
}

export default CartMenu;
