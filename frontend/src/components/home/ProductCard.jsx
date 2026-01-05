import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

function ProductCard({ product }) {
  const truncateTitle = (text, maxLength = 50) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const displayTitle = truncateTitle(product.name);
  const isLongTitle = product.name.length > 50;

  // Composant Typography partagé pour éviter la duplication
  const titleComponent = (
    <Typography
      variant="h6"
      component="h3"
      sx={{
        fontWeight: 500,
        color: "#1a1a1a",
        mb: 1,
        minHeight: "3em",
        lineHeight: "1.5em",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
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
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.image ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Typography variant="h1" sx={{ fontSize: "4rem" }}>
            📦
          </Typography>
        )}
      </CardMedia>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Titre avec Tooltip uniquement si nécessaire */}
        {isLongTitle ? (
          <Tooltip title={product.name} arrow placement="top">
            <Box>{titleComponent}</Box>
          </Tooltip>
        ) : (
          titleComponent
        )}

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#3E5F44",
            mb: 2,
          }}
        >
          {product.price}
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<ShoppingCart />}
          sx={{
            mt: "auto",
            py: 1.2,
            borderColor: "#3E5F44",
            color: "#3E5F44",
            textTransform: "none",
            fontSize: "0.95rem",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#3E5F44",
              backgroundColor: "#3E5F44",
              color: "white",
            },
          }}
        >
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;