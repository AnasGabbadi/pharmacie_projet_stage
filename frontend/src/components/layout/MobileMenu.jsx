// src/components/layout/MobileMenu.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Close, Home, Store, LocalOffer, ContactMail, Person } from "@mui/icons-material";
import { Link } from "react-router-dom";

function MobileMenu({ open, onClose }) {
  const menuItems = [
    { title: "Accueil", path: "/", icon: <Home /> },
    { title: "Produits", path: "/produits", icon: <Store /> },
    { title: "Promotions", path: "/promotions", icon: <LocalOffer /> },
    { title: "Contact", path: "/contact", icon: <ContactMail /> },
    { title: "Mon Profil", path: "/profil", icon: <Person /> },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }}>
        <Box
          sx={{
            p: 2,
            backgroundColor: "#3E5F44",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton component={Link} to={item.path} onClick={onClose}>
                <Box sx={{ mr: 2, color: "#3E5F44" }}>{item.icon}</Box>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default MobileMenu;
