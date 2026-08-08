import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ShoppingCart, Check } from "@mui/icons-material";
import { useCart } from "../../hooks/useCart";

function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  const truncateTitle = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const displayTitle = truncateTitle(product.name || product.nom);
  const isLongTitle = (product.name || product.nom).length > 50;

  const handleAddToCart = async () => {
    setIsAdding(true);
    setError(null);
    
    try {
      console.log("🛒 Ajout produit:", product._id);
      
      const result = await addItem({ 
        productId: product._id || product.id, 
        quantity: 1 
      });
      
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
        
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        setError(result.message || "Erreur lors de l'ajout au panier");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("❌ Erreur ajout panier:", err);
      setError(err.message || "Une erreur est survenue");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsAdding(false);
    }
  };

  const titleComponent = (
    <Typography
      variant="h6"
      sx={{
        fontWeight: 600,
        fontSize: "1rem",
        color: "#2d3436",
        mb: 1,
      }}
    >
      {displayTitle}
    </Typography>
  );

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        border: "1px solid #e8e8e8",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Box sx={{ position: "relative", paddingTop: "100%", overflow: "hidden" }}>
        {product.image ? (
          <CardMedia
            component="img"
            image={product.image}
            alt={product.name || product.nom}
            onError={(e) => {
              console.error("Erreur image:", product.image);
              e.target.src = "/api/placeholder/300/300";
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
              fontSize: "4rem",
            }}
          >
            📦
          </Box>
        )}

        {/* Badge stock faible */}
        {product.stock > 0 && product.stock < 10 && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#ff9800",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Stock: {product.stock}
          </Box>
        )}

        {/* Badge rupture */}
        {product.stock === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#f44336",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            Rupture
          </Box>
        )}
      </Box>

      {/* Contenu */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Titre */}
        {isLongTitle ? (
          <Tooltip title={product.name || product.nom} arrow>
            {titleComponent}
          </Tooltip>
        ) : (
          titleComponent
        )}

        {/* Prix */}
        <Typography
          variant="h5"
          sx={{
            color: "#3E5F44",
            fontWeight: 700,
            mb: 2,
          }}
        >
          {(product.price || product.prix)?.toLocaleString()} DH
        </Typography>

        {/* Message d'erreur */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, py: 0 }}>
            {error}
          </Alert>
        )}

        {/* Bouton Ajouter au panier */}
        <Button
          variant="outlined"
          fullWidth
          startIcon={
            isAdding ? (
              <CircularProgress size={20} />
            ) : added ? (
              <Check />
            ) : (
              <ShoppingCart />
            )
          }
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          sx={{
            mt: "auto",
            py: 1.2,
            borderColor: added ? "#4caf50" : "#3E5F44",
            color: added ? "#4caf50" : "#3E5F44",
            backgroundColor: added ? "#e8f5e9" : "transparent",
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            "&:hover": {
              borderColor: added ? "#4caf50" : "#3E5F44",
              backgroundColor: added ? "#c8e6c9" : "#3E5F44",
              color: added ? "#4caf50" : "white",
            },
            "&.Mui-disabled": {
              borderColor: "#ccc",
              color: "#999",
            },
          }}
        >
          {isAdding
            ? "Ajout..."
            : added
            ? "Ajouté"
            : product.stock === 0
            ? "Rupture de stock"
            : "Ajouter au panier"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;