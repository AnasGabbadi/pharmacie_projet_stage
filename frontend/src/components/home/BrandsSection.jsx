// src/pages/home/components/BrandsSection.jsx
import { Container, Typography, Box, Grid } from "@mui/material";

const brands = [
  { id: 1, name: "La Roche-Posay", logo: "/brands/laroche.png" },
  { id: 2, name: "Vichy", logo: "/brands/vichy.png" },
  { id: 3, name: "Bioderma", logo: "/brands/bioderma.png" },
  { id: 4, name: "Avène", logo: "/brands/avene.png" },
  { id: 5, name: "Nuxe", logo: "/brands/nuxe.png" },
  { id: 6, name: "Eucerin", logo: "/brands/eucerin.png" },
];

function BrandsSection() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h3"
        fontWeight={700}
        textAlign="center"
        sx={{ mb: 6, color: "#3E5F44" }}
      >
        Nos Marques Partenaires
      </Typography>

      <Grid container spacing={4} alignItems="center" justifyContent="center">
        {brands.map((brand) => (
          <Grid item xs={6} sm={4} md={2} key={brand.id}>
            <Box
              sx={{
                textAlign: "center",
                cursor: "pointer",
                opacity: 0.7,
                transition: "opacity 0.3s ease",
                "&:hover": {
                  opacity: 1,
                },
              }}
            >
              <Box
                component="img"
                src={brand.logo}
                alt={brand.name}
                sx={{
                  width: "100%",
                  maxWidth: 120,
                  height: "auto",
                  filter: "grayscale(100%)",
                  transition: "filter 0.3s ease",
                  "&:hover": {
                    filter: "grayscale(0%)",
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BrandsSection;