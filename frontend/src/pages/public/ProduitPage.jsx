import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
} from "@mui/material";
import { ShoppingCart, Check, ArrowBack } from "@mui/icons-material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductCard from "../../components/home/ProductCard";
import produitsApi from "../../api/produits";
import { useCart } from "../../hooks/useCart";

function ProduitPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const [similaires, setSimilaires] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchProduit = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setProduit(null);
    setSimilaires([]);

    try {
      const { ok, status, data } = await produitsApi.getProduitById(id);

      if (status === 404) {
        setNotFound(true);
        return;
      }
      if (!ok) {
        throw new Error(data?.message || `Erreur HTTP ${status}`);
      }

      setProduit(data);

      if (data.categorieId) {
        try {
          const liste = await produitsApi.getProduits({
            categorie: data.categorieId,
            limite: 5,
          });
          if (Array.isArray(liste)) {
            setSimilaires(
              liste
                .filter((p) => p._id !== data._id && p.actif !== false)
                .slice(0, 4)
                .map((p) => ({ ...p, image: p.imageUrl }))
            );
          }
        } catch {
          // Section "produits similaires" simplement absente en cas d'échec.
        }
      }
    } catch (err) {
      setError(err.message || "Erreur lors du chargement du produit");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduit();
  }, [fetchProduit]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setCartError(null);
    try {
      const result = await addItem({ productId: produit._id, quantity: 1 });
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        setCartError(result.message || "Erreur lors de l'ajout au panier");
        setTimeout(() => setCartError(null), 3000);
      }
    } catch (err) {
      setCartError(err.message || "Une erreur est survenue");
      setTimeout(() => setCartError(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress size={60} sx={{ color: "#3E5F44" }} />
          <Typography variant="body1" color="text.secondary">
            Chargement du produit...
          </Typography>
        </Box>
        <Footer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Container maxWidth="sm" sx={{ my: 8, textAlign: "center" }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Ce produit n'existe pas ou n'est plus disponible.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, textTransform: "none" }}
          >
            Retour à l'accueil
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Container maxWidth="sm" sx={{ my: 8 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={fetchProduit}>
                Réessayer
              </Button>
            }
          >
            {error}
          </Alert>
        </Container>
        <Footer />
      </div>
    );
  }

  const enRupture = produit.stock === 0;
  const stockFaible = produit.stock > 0 && produit.stock < 10;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ border: "1px solid #e0e0e0", backgroundColor: "white", mb: 3 }}
          >
            <ArrowBack />
          </IconButton>

          <Stack direction={{ xs: "column", md: "row" }} gap={4} alignItems="flex-start">
            {/* Image */}
            <Box
              sx={{
                width: { xs: "100%", md: 420 },
                flexShrink: 0,
                position: "relative",
                paddingTop: { xs: "100%", md: "420px" },
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #e8e8e8",
                backgroundColor: "white",
              }}
            >
              {produit.imageUrl ? (
                <Box
                  component="img"
                  src={produit.imageUrl}
                  alt={produit.nom}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f5f5f5",
                    fontSize: "6rem",
                  }}
                >
                  📦
                </Box>
              )}
            </Box>

            {/* Détails */}
            <Box flex={1} minWidth={0}>
              <Typography variant="h4" fontWeight={700} color="#2d3436" mb={1}>
                {produit.nom}
              </Typography>

              <Typography variant="h4" sx={{ color: "#3E5F44", fontWeight: 700, mb: 2 }}>
                {produit.prix?.toLocaleString()} DH
              </Typography>

              {enRupture && (
                <Alert severity="error" sx={{ mb: 2, maxWidth: 420 }}>
                  Rupture de stock
                </Alert>
              )}
              {stockFaible && (
                <Alert severity="warning" sx={{ mb: 2, maxWidth: 420 }}>
                  Stock limité : encore {produit.stock} unité{produit.stock > 1 ? "s" : ""}
                </Alert>
              )}
              {!enRupture && !stockFaible && (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  En stock
                </Typography>
              )}

              {produit.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, whiteSpace: "pre-line" }}>
                  {produit.description}
                </Typography>
              )}

              {cartError && (
                <Alert severity="error" sx={{ mb: 2, maxWidth: 420 }}>
                  {cartError}
                </Alert>
              )}

              <Button
                variant="contained"
                startIcon={
                  isAdding ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : added ? (
                    <Check />
                  ) : (
                    <ShoppingCart />
                  )
                }
                onClick={handleAddToCart}
                disabled={isAdding || enRupture}
                sx={{
                  py: 1.5,
                  px: 4,
                  backgroundColor: added ? "#4caf50" : "#3E5F44",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: added ? "#43a047" : "#2f4734",
                  },
                }}
              >
                {isAdding
                  ? "Ajout..."
                  : added
                  ? "Ajouté au panier"
                  : enRupture
                  ? "Rupture de stock"
                  : "Ajouter au panier"}
              </Button>
            </Box>
          </Stack>

          {/* Produits similaires */}
          {similaires.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography variant="h5" fontWeight={700} color="#2d3436" mb={3}>
                Produits similaires
              </Typography>
              <Grid container spacing={3}>
                {similaires.map((p) => (
                  <Grid key={p._id} size={{ xs: 12, sm: 6, md: 3 }}>
                    <ProductCard product={p} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
      <Footer />
    </div>
  );
}

export default ProduitPage;
