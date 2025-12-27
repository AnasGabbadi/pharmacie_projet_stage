import { useRef, useState } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authApi";
import { useAuth } from "../context/Auth/AuthContext";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const motDePasseRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const email = emailRef.current?.value.trim();
    const motDePasse = motDePasseRef.current?.value.trim();

    if (!email || !motDePasse) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer un email valide");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // loginAdmin utilise apiFetch → renvoie déjà le body JSON OU lance une erreur
      const data = await loginAdmin({ email, motDePasse });

      const token = data?.token;
      const utilisateur = data?.utilisateur;

      if (!token || !utilisateur) {
        setError("Erreur lors de l'authentification !");
        return;
      }

      localStorage.setItem("admin_token", token);
      login({ token, utilisateur });
      navigate("/admin");
    } catch (err) {
      console.error("Erreur serveur :", err);
      setError(
        err.message ||
          "Identifiants incorrects ou erreur de connexion au serveur."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isLoading) {
      onSubmit();
    }
  };

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
          onKeyPress={handleKeyPress}
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

          <Typography
            variant="h5"
            component="h1"
            fontWeight="600"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            Se connecter
          </Typography>

          <TextField
            inputRef={emailRef}
            label="Adresse email"
            type="email"
            fullWidth
            required
            disabled={isLoading}
            autoComplete="email"
            autoFocus
            error={error.toLowerCase().includes("email")}
          />

          <TextField
            inputRef={motDePasseRef}
            label="Mot de passe"
            type="password"
            fullWidth
            required
            disabled={isLoading}
            autoComplete="current-password"
            error={
              error.toLowerCase().includes("mot de passe") ||
              error.toLowerCase().includes("identifiants")
            }
          />

          <Button
            onClick={onSubmit}
            variant="contained"
            fullWidth
            disabled={isLoading}
            size="large"
            sx={{
              mt: 1,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: "#3E5F44",
            }}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;