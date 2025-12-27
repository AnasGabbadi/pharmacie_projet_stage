// src/pages/home/components/FeaturedProducts.jsx
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Simuler le fetch depuis l'API
    setProducts([
      {
        id: 1,
        nom: "Crème hydratante visage",
        prix: 450,
        imageUrl: "/products/creme1.jpg",
        promo: true,
      },
      {
        id: 2,
        nom: "Complément alimentaire",
        prix: 150,
        imageUrl: "/products/complements.jpg",
      },
      {
        id: 3,
        nom: "Sérum anti-âge",
        prix: 330,
        imageUrl: "/products/serum.jpg",
        promo: true,
      },
      {
        id: 4,
        nom: "Huile d'argan bio",
        prix: 120,
        imageUrl: "/products/argan.jpg",
      },
    ]);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        sx={{ mb: 2, color: "#3E5F44" }}
      >
        Produits Populaires
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Découvrez nos meilleures ventes
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                },
                position: "relative",
              }}
            >
              {product.promo && (
                <Chip
                  label="PROMO"
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 1,
                    fontWeight: 700,
                  }}
                />
              )}

              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl}
                alt={product.nom}
                sx={{ objectFit: "cover" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {product.nom}
                </Typography>

                <Typography
                  variant="h5"
                  color="#3E5F44"
                  fontWeight={700}
                  sx={{ mb: 2 }}
                >
                  {product.prix} DH
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  sx={{
                    backgroundColor: "#3E5F44",
                    "&:hover": {
                      backgroundColor: "#2f4734",
                    },
                    textTransform: "none",
                  }}
                >
                  Ajouter au panier
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box textAlign="center" mt={6}>
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#3E5F44",
            color: "#3E5F44",
            px: 4,
            py: 1.5,
            "&:hover": {
              borderColor: "#2f4734",
              backgroundColor: "#3E5F4410",
            },
          }}
        >
          Voir tous les produits
        </Button>
      </Box>
    </Container>
  );
}

export default FeaturedProducts;
