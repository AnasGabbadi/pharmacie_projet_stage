import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Skeleton,
  alpha,
} from "@mui/material";
import {
  Face,
  LocalPharmacy,
  ChildCare,
  Favorite,
  Spa,
  FitnessCenter,
  LocalOffer,
  Healing,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { adminGetCategories } from "../../services/categoriesAdminApi";

// Map des icônes par nom de catégorie  
const iconMap = {
  "Soins Visage": Face,
  "soins-visage": Face,
  "Médicaments": LocalPharmacy,
  "medicaments": LocalPharmacy,
  "Bébé": ChildCare,
  "bebe": ChildCare,
  "Bien-être": Favorite,
  "bien-etre": Favorite,
  "Beauté": Spa,
  "beaute": Spa,
  "Sport": FitnessCenter,
  "sport": FitnessCenter,
  "Compléments": Healing,
  "complements": Healing,
  "Promotions": LocalOffer,
  "promotions": LocalOffer,
};

// Couleurs dynamiques
const colors = [
  "#FF6B9D",
  "#4CAF50",
  "#FF9800",
  "#E91E63",
  "#9C27B0",
  "#2196F3",
  "#00BCD4",
  "#FFC107",
];

function CategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // ✅ adminGetCategories retourne déjà un objet JS
      const response = await adminGetCategories();
      
      // ✅ Extraire le tableau (soit items, soit directement le tableau)
      const data = Array.isArray(response) ? response : response.items || [];

      console.log("📦 Catégories chargées:", data);

      // Mapper les catégories avec icônes et couleurs
      const mappedCategories = data.map((cat, index) => ({
        ...cat,
        icon: iconMap[cat.slug] || iconMap[cat.nom] || LocalPharmacy,
        color: colors[index % colors.length],
      }));

      setCategories(mappedCategories);
    } catch (error) {
      console.error("❌ Erreur chargement catégories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId, categorySlug) => {
    navigate(`/produits?categorie=${categorySlug || categoryId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 6, color: "#3E5F44" }}
        >
          Nos Catégories
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        sx={{ mb: 2, color: "#3E5F44" }}
      >
        Nos Catégories
      </Typography>
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Découvrez notre large gamme de produits
      </Typography>

      <Grid container spacing={3}>
        {categories
          .filter((cat) => cat.active)
          .map((category) => {
            const Icon = category.icon;
            return (
              <Grid item xs={6} sm={4} md={2} key={category._id}>
                <Card
                  onClick={() => handleCategoryClick(category._id, category.slug)}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 3,
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "2px solid transparent",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      boxShadow: `0 12px 32px ${alpha(category.color, 0.3)}`,
                      borderColor: category.color,
                      "& .category-icon": {
                        transform: "scale(1.15) rotate(5deg)",
                      },
                      "& .category-bg": {
                        transform: "scale(1.1)",
                        opacity: 0.15,
                      },
                    },
                  }}
                >
                  {/* Background Gradient */}
                  <Box
                    className="category-bg"
                    sx={{
                      position: "absolute",
                      top: -50,
                      right: -50,
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${alpha(
                        category.color,
                        0.2
                      )} 0%, transparent 70%)`,
                      transition: "all 0.4s ease",
                      opacity: 0.1,
                    }}
                  />

                  <CardContent sx={{ py: 3, position: "relative" }}>
                    {/* Icon Container */}
                    <Box
                      className="category-icon"
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${alpha(
                          category.color,
                          0.15
                        )} 0%, ${alpha(category.color, 0.05)} 100%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                        transition: "all 0.4s ease",
                        border: `2px solid ${alpha(category.color, 0.2)}`,
                      }}
                    >
                      <Icon
                        sx={{
                          fontSize: 40,
                          color: category.color,
                        }}
                      />
                    </Box>

                    {/* Category Name */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{
                        color: "#333",
                        fontSize: "0.95rem",
                      }}
                    >
                      {category.nom}
                    </Typography>

                    {/* Product Count (optionnel) */}
                    {category.productCount && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          mt: 0.5,
                          display: "block",
                        }}
                      >
                        {category.productCount} produits
                      </Typography>
                    )}
                  </CardContent>

                  {/* Hover Border Effect */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${category.color} 0%, ${alpha(
                        category.color,
                        0.5
                      )} 100%)`,
                      transform: "scaleX(0)",
                      transformOrigin: "left",
                      transition: "transform 0.4s ease",
                      ".MuiCard-root:hover &": {
                        transform: "scaleX(1)",
                      },
                    }}
                  />
                </Card>
              </Grid>
            );
          })}
      </Grid>

      {/* View All Button */}
      {categories.length > 6 && (
        <Box textAlign="center" mt={4}>
          <Typography
            onClick={() => navigate("/categories")}
            sx={{
              color: "#3E5F44",
              cursor: "pointer",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Voir toutes les catégories →
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default CategoriesSection;