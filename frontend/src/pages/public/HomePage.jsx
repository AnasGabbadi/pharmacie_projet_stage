import { useState, useEffect, useCallback } from "react";
import { CircularProgress, Box, Alert, Button, Typography } from "@mui/material";
import CategoriesSection from "../../components/home/CategoriesSection";
import CTASection from "../../components/home/CTASection";
import Features from "../../components/home/FeaturedProducts";
import HeroSection from "../../components/home/HeroSection";
import ProductSection from "../../components/home/ProductsSection";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { getProduits } from "../../services/produitsApi";
import BrandsSection from "../../components/home/BrandsSection";
import PromoBannerAlt from "../../components/home/PromoBanner";

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction de formatage mémorisée
  const formatProduct = useCallback((product, prefix = "") => ({
    id: `${prefix}-${product._id || product.id || Math.random()}`,
    originalId: product._id || product.id,
    name: product.nom,
    price: `${product.prix} DH`,
    image: product.imageUrl || null,
    stock: product.stock,
    description: product.description
  }), []);

  // Fonction fetchProducts mémorisée
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const allProducts = await getProduits();
      
      // Vérification que les données sont valides
      if (!Array.isArray(allProducts) || allProducts.length === 0) {
        throw new Error("Aucun produit disponible");
      }

      // Featured products avec préfixe "featured"
      const featured = allProducts
        .slice(0, 4)
        .map((product, index) => formatProduct(product, `featured-${index}`));

      // New products avec préfixe "new"
      const newest = allProducts
        .slice(-4)
        .map((product, index) => formatProduct(product, `new-${index}`));

      setFeaturedProducts(featured);
      setNewProducts(newest);
    } catch (err) {
      console.error("Erreur lors du chargement des produits:", err);
      setError(
        err.message || "Impossible de charger les produits. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  }, [formatProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fonction de retry
  const handleRetry = () => {
    fetchProducts();
  };

  // Affichage pendant le chargement
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
            Chargement des produits...
          </Typography>
        </Box>
        <Footer />
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <Box sx={{ maxWidth: 800, mx: "auto", my: 4, px: 2 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Réessayer
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <Features />
      <CategoriesSection />
      
      {featuredProducts.length > 0 && (
        <ProductSection 
          title="Nos produits phares" 
          products={featuredProducts} 
        />
      )}
      
      <PromoBannerAlt />

      {newProducts.length > 0 && (
        <ProductSection 
          title="Nouveautés" 
          products={newProducts} 
        />
      )}

        <BrandsSection />
      
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomePage;