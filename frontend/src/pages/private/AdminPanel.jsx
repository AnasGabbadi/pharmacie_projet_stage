import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import { Button, Stack } from "@mui/material";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";

import Dashboard from "../../components/dashboard/AdminDashboard/Dashboard";
import ProduitsCrud from "../../components/dashboard/AdminDashboard/crud/ProduitsCrud";
import CategoriesCrud from "../../components/dashboard/AdminDashboard/crud/CategoriesCrud";
import ProfilPage from "./ProfilPage";
import auth from "../../api/auth";
import UsersCrud from "../../components/dashboard/AdminDashboard/crud/UsersCrud";
import CommandesCrud from "../../components/dashboard/AdminDashboard/crud/CommandesCrud";

const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Tableau de bord",
    icon: <DashboardIcon />,
  },
  {
    segment: "produits",
    title: "Produits",
    icon: <InventoryIcon />,
  },
  {
    segment: "categories",
    title: "Catégories",
    icon: <InventoryIcon />,
  },
  {
    segment: "commandes",
    title: "Commandes",
    icon: <InventoryIcon />,
  },
  {
    segment: "utilisateurs",
    title: "Utilisateurs",
    icon: <InventoryIcon />,
  },
  {
    segment: "profil",
    title: "Mon Profil",
    icon: <InventoryIcon />,
  },
];

const adminTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: false },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#3E5F44",
          "& .MuiListItemIcon-root": {
            color: "#3E5F44",
          },
          "&:hover": {
            backgroundColor: "#f6fff0ff",
            color: "#3E5F44",
          },
          "&:hover .MuiListItemIcon-root": {
            color: "#3E5F44",
          },
        },
      },
    },
  },     
});

function SidebarFooterLogout({ mini }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.log("Logout client seulement");
    }
    
    window.location.href = "/login";
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ p: 2, borderTop: "1px solid rgba(232,255,215,0.2)" }}
    >
      <Button
        onClick={handleLogout}
        startIcon={<LogOut size={18} />}
        color="error"
        variant="text"
        sx={{ 
          color: "#d32f2f",
          "&:hover": { backgroundColor: "rgba(211,47,47,0.04)" }
        }}
      >
        {!mini && "Déconnexion"}
      </Button>
    </Stack>
  );
}

function renderPageContent(pathname) {
  switch (pathname) {
    case "/dashboard":
      return <Dashboard />;
    case "/produits":
      return <ProduitsCrud />;
    case "/categories":
      return <CategoriesCrud />;
    case "/commandes":
      return <CommandesCrud />;
    case "/utilisateurs":
      return <UsersCrud />;
    case "/profil":
      return <ProfilPage />;
    default:
      return <Dashboard />;
  }
}

function AdminPanel(props) {
  const { window } = props || {};
  const router = useDemoRouter("/dashboard");
  const demoWindow = window ? window() : undefined;

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: (
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#3E5F44" }}
            >
              ParaVital
            </Typography>
          ),
          title: "",
          homeUrl: "/dashboard",
        }}
        router={router}
        theme={adminTheme}
        window={demoWindow}
      >
        <DashboardLayout
          slots={{
            sidebarFooter: SidebarFooterLogout,
          }}
        >
          {renderPageContent(router.pathname)}
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

export default AdminPanel;