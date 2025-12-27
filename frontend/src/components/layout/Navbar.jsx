import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Badge,
  Button,
  Stack,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  LocalShipping,
  Phone,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import CartMenu from "./CartMenu";
import MobileMenu from "./MobileMenu";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartMenuAnchor, setCartMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  const isAuthenticated = !!localStorage.getItem("user_token");
  const cartItemsCount = 3; // À remplacer par le vrai count du panier

  const handleCartOpen = (event) => {
    setCartMenuAnchor(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartMenuAnchor(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    handleUserMenuClose();
    navigate("/");
  };

  return (
    <>
      {/* Top Bar (Info) */}
      <Box
        sx={{
          backgroundColor: "#3E5F44",
          color: "white",
          py: 1,
          display: { xs: "none", md: "block" },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <LocalShipping fontSize="small" />
                <Typography variant="body2">
                  Livraison gratuite à partir de 300 DH
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Phone fontSize="small" />
                <Typography variant="body2">+212 5XX-XXXXXX</Typography>
              </Stack>
            </Stack>

            {isAuthenticated ? (
              <Typography variant="body2">
                Bienvenue, Client
              </Typography>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  to="admin/login"
                  sx={{ color: "white", fontSize: "0.875rem" }}
                >
                  Espace Administrateur
                </Button>
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Main Navbar */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              sx={{
                display: { xs: "flex", md: "none" },
                color: "#3E5F44",
                mr: 2,
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                mr: { xs: 2, md: 4 },
              }}
            >
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Parapharma
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 4,
              }}
            >
              <Button
                component={Link}
                to="/"
                sx={{
                  color: "#333",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#3E5F44",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Accueil
              </Button>
              <Button
                component={Link}
                to="/produits"
                sx={{
                  color: "#333",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#3E5F44",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Produits
              </Button>
              <Button
                component={Link}
                to="/promotions"
                sx={{
                  color: "#FF6B9D",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    color: "#FF8FAB",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Promotions
              </Button>
              <Button
                component={Link}
                to="/contact"
                sx={{
                  color: "#333",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#3E5F44",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Contact
              </Button>
            </Stack>

            {/* Search Bar */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }}>
              <SearchBar />
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
              {/* Cart */}
              <IconButton
                onClick={handleCartOpen}
                sx={{
                  color: "#3E5F44",
                }}
              >
                <Badge badgeContent={cartItemsCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </Stack>
          </Toolbar>

          {/* Mobile Search */}
          <Box sx={{ display: { xs: "block", md: "none" }, pb: 2 }}>
            <SearchBar />
          </Box>
        </Container>
      </AppBar>

      {/* Cart Menu */}
      <CartMenu
        anchorEl={cartMenuAnchor}
        open={Boolean(cartMenuAnchor)}
        onClose={handleCartClose}
      />

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isAuthenticated ? (
          [
            <MenuItem
              key="profile"
              onClick={() => {
                navigate("/profil");
                handleUserMenuClose();
              }}
            >
              Mon Profil
            </MenuItem>,
            <MenuItem
              key="orders"
              onClick={() => {
                navigate("/commandes");
                handleUserMenuClose();
              }}
            >
              Mes Commandes
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              Déconnexion
            </MenuItem>,
          ]
        ) : (
          [
            <MenuItem
              key="login"
              onClick={() => {
                navigate("/login");
                handleUserMenuClose();
              }}
            >
              Connexion
            </MenuItem>,
            <MenuItem
              key="register"
              onClick={() => {
                navigate("/register");
                handleUserMenuClose();
              }}
            >
              Inscription
            </MenuItem>,
          ]
        )}
      </Menu>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

export default Navbar;
