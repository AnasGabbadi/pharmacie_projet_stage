import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import { Button, Stack } from "@mui/material";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { DemoProvider, useDemoRouter } from "@toolpad/core/internal";

// import PanierPage from "../../components/dashboard/AdminDashboard/PanierPage";
import ProfilPage from "./ProfilPage";
import Dashboard from "../../components/dashboard/ClientDashboard/Dashboard";
import CommandesCrud from "../../components/dashboard/ClientDashboard/crud/CommandesCrud";
import PanierCrud from "../../components/dashboard/ClientDashboard/crud/PanierCrud";

const NAVIGATION = [
  {
    segment: "dashboard",
    title: "Tableau de bord",
    icon: <DashboardIcon />,
  },
  {
    segment: "panier",
    title: "Mon panier",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "commandes",
    title: "Mes commandes",
    icon: <ShoppingCartIcon />,
  },
  {
    segment: "profil",
    title: "Mon Profil",
    icon: <PersonIcon />,
  },
];

const clientTheme = createTheme({
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
  const { logout } = useAuth(); // ✅ Nouveau hook

  const handleLogout = () => {
    logout(); // ✅ Hook unifié
    window.location.href = "/";
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
    case "/panier":
      return <PanierCrud />;       
    case "/commandes":
      return <CommandesCrud />;     
    case "/profil":
      return <ProfilPage />;    
    default:
      return <Dashboard />;
  }
}

function ClientPanel(props) {
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
          homeUrl: "/client/dashboard",
        }}
        router={router}
        theme={clientTheme}
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

export default ClientPanel;