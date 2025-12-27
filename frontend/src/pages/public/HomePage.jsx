// src/pages/home/HomePage.jsx
import { Box } from "@mui/material";
import HeroSection from "../../components/home/HeroSection";
import CategoriesSection from "../../components/home/CategoriesSection";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import BrandsSection from "../../components/home/BrandsSection";
import Navbar from "../../components/layout/Navbar";

function HomePage() {
  return (
    <>
        <Navbar />
        <Box sx={{ backgroundColor: "#f8f9fa" }}>
        <HeroSection />
        <CategoriesSection />
        <FeaturedProducts />
        <BrandsSection />
        </Box>
    </>
  );
}

export default HomePage;