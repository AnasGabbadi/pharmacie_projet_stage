import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { LocalShipping, VerifiedUser, LocalOffer } from "@mui/icons-material";

function HeroSection() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
        color: "white",
        py: { xs: 6, md: 10 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
        >
          {/* Texte principal */}
          <Box flex={1}>
            <Typography
              variant="h2"
              fontWeight={700}
              sx={{
                fontSize: { xs: "2rem", md: "3.5rem" },
                mb: 2,
              }}
            >
              Votre Parapharmacie en Ligne au Maroc
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              Découvrez nos produits de qualité pour votre santé et bien-être
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "white",
                  color: "#3E5F44",
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                Découvrir nos produits
              </Button>
            </Stack>
          </Box>

          {/* Image Hero */}
          <Box
            flex={1}
            sx={{
              display: { xs: "none", md: "block" },
            }}
          >
            <Box
              component="img"
              src="/images/img1.jpg"
              alt="Pharmacie"
              sx={{
                width: "100%",
                maxWidth: 800,
                height: "auto",
              }}
            />
          </Box>
        </Stack>

        {/* Features */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{
            mt: 8,
            justifyContent: "space-around",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <LocalShipping sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Livraison rapide
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Partout au Maroc
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <VerifiedUser sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Produits certifiés
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Qualité garantie
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <LocalOffer sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Promotions
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Offres exclusives
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default HeroSection;
