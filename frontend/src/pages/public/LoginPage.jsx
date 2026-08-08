import { useRef, useState, useEffect } from "react"; // ✅ useEffect ajouté
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");        // ✅ useState au lieu de ref
  const [motDePasse, setMotDePasse] = useState("");
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // 🔄 Redirection auto (CORRIGÉE avec useEffect)
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Hook login gère déjà la redirection !
      return;
    }
  }, [isAuthenticated, authLoading]);

  const onSubmit = async (e) => {
  e.preventDefault();
  console.log("🔥 SUBMIT START");
  
  // Validation
  if (!email.trim() || !motDePasse.trim()) {
    setError("Veuillez remplir tous les champs");
    return;
  }

  setIsLoading(true);
  setError("");

  try {
    console.log("📡 API LOGIN...");
    const result = await login(email.trim(), motDePasse.trim());
    console.log("✅ RESULT:", result);

    if (result.success) {
      console.log("🎉 SUCCESS - REDIRECT:", result.redirect || result.role);
      
      // FORCE MAXIMUM
      const url = result.redirect || (result.role === "admin" ? "/admin" : "/client/dashboard");
      
      // 4 MÉTHODES SIMULTANÉES
      window.location.href = url;
      window.location.assign(url);
      window.location.replace(url);
      navigate(url, { replace: true });
      
      // ULTIME SECURITY
      setTimeout(() => {
        window.location.href = "/admin";
      }, 100);
      
      return; // STOP TOUT
    }
    
    setError(result.message || "Identifiants incorrects");
  } catch (err) {
    console.error("❌ ERREUR:", err);
    setError("Erreur serveur");
  }
  
  setIsLoading(false); // UNIQUEMENT si échec
};

  // Si authentification en cours
  if (authLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress sx={{ color: "#3E5F44" }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={onSubmit}           
          sx={{
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            padding: { xs: 3, sm: 4 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* Logo */}
          <Typography
            variant="h5"
            component="h1"
            fontSize={{ xs: "8vw", md: "1.5vw" }}
            color="#3E5F44"
            fontWeight="bold"
            textAlign="center"
            sx={{
              textDecoration: "underline",
              textUnderlineOffset: "5px",
            }}
          >
            ParaVital
          </Typography>

          {/* Titre */}
          <Typography
            variant="h5"
            component="h1"
            fontWeight="600"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            Se connecter
          </Typography>

          {/* Email */}
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // ✅ Controlled
            label="Adresse email"
            type="email"
            fullWidth
            required
            disabled={isLoading || authLoading}
            autoComplete="email"
            autoFocus
            error={error.toLowerCase().includes("email")}
            helperText={error.toLowerCase().includes("email") ? error : ""}
          />

          {/* Mot de passe */}
          <TextField
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)} // ✅ Controlled
            label="Mot de passe"
            type="password"
            fullWidth
            required
            disabled={isLoading || authLoading}
            autoComplete="current-password"
            error={error.toLowerCase().includes("password") || 
                   error.toLowerCase().includes("identifiants")}
            helperText={
              (error.toLowerCase().includes("password") || 
               error.toLowerCase().includes("identifiants"))
                ? error
                : ""
            }
          />

          {/* Bouton */}
          <Button
            type="submit"                       // ✅ type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || authLoading}
            size="large"
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: "#3E5F44",
              "&:hover": { backgroundColor: "#2e4a35" },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>

          {/* Erreur */}
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {/* Lien register */}
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Pas de compte ?{" "}
            <Button 
              href="/register" 
              sx={{ 
                color: "#3E5F44", 
                fontWeight: 500, 
                p: 0, 
                minWidth: "auto",
                textTransform: "none"
              }}
            >
              Créer un compte
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;