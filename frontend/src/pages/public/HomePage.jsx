import { useState, useEffect, useCallback } from "react";
import { CircularProgress, Box, Alert, Button, Typography } from "@mui/material";
import CategoriesSection from "../../components/home/CategoriesSection";
import CTASection from "../../components/home/CTASection";
import Features from "../../components/home/FeaturedProducts";
import HeroSection from "../../components/home/HeroSection";
import ProductSection from "../../components/home/ProductsSection";
import ProductSearchSection from "../../components/home/ProductSearchSection";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { useProduits } from "../../hooks/useProduits";       
import BrandsSection from "../../components/home/BrandsSection";
import PromoBannerAlt from "../../components/home/PromoBanner";

function HomePage() {
  const { data: allProducts, loading, error, refetch } = useProduits();

  const formatProduct = useCallback((product, prefix = "") => ({
    _id: product._id || product.id,    
    id: product._id || product.id,      
    name: product.nom,
    prix: product.prix,                  
    stock: product.stock,
    image: product.imageUrl || product.images?.[0] || null,
    description: product.description,
    categorie: product.categorie?.nom || "Non classé",
    
    slug: `${prefix}-${product._id || product.id}`,
  }), []);

  const featuredProducts = useCallback(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return [];
    
    return allProducts
      .filter(p => p.actif) 
      .slice(0, 8)
      .map((product, index) => formatProduct(product, `featured-${index}`));
  }, [allProducts, formatProduct]);

  const newProducts = useCallback(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return [];
    
    return allProducts
      .filter(p => p.actif)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8)
      .map((product, index) => formatProduct(product, `new-${index}`));
  }, [allProducts, formatProduct]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

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
            Chargement des produits phares...
          </Typography>
        </Box>
        <Footer />
      </div>
    );
  }

  // Error state (géré par hook)
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
      
      {/* Sections fixes */}
      <HeroSection />
      <Features />
      <CategoriesSection />

      {/* Recherche, filtres et pagination sur l'ensemble du catalogue */}
      <ProductSearchSection />

      {/* Produits phares */}
      {featuredProducts().length > 0 && (
        <ProductSection 
          title="Nos produits phares" 
          products={featuredProducts()}
          sx={{ my: 4 }}
        />
      )}

      <PromoBannerAlt />

      {/* Nouveautés */}
      {newProducts().length > 0 && (
        <ProductSection 
          title="Nouveautés" 
          products={newProducts()}
          sx={{ my: 4 }}
        />
      )}

      <BrandsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomePage;