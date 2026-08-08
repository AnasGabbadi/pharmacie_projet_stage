import { useState } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import authService from "../../api/auth";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    motDePasse: "",
    adresse: { rue: "", ville: "", codePostal: "", pays: "Maroc" }
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("🔥 REGISTER START");

    // Validation Frontend
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || 
        !formData.telephone.trim() || !formData.motDePasse.trim()) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.motDePasse.length < 8) {
      setError("Mot de passe trop court (minimum 8 caractères)");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email invalide");
      return;
    }

    // Validation téléphone Maroc
    const phoneRegex = /^(\+212|0)[67]\d{8}$/;
    if (!phoneRegex.test(formData.telephone.replace(/\s/g, ''))) {
      setError("Numéro de téléphone invalide (06/07 + 8 chiffres)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("📡 API REGISTER...");
      
      // ✅ CORRECTION : authService.register (PAS register seul)
      const result = await authService.register(formData);
      console.log("✅ RESULT:", result);

      if (result.success) {
        console.log("🎉 REGISTER SUCCESS - REDIRECT:", result.redirect);
        window.location.href = result.redirect || "/client/dashboard";
        return;
      }
      
      setError(result.message || "Erreur lors de l'inscription");
    } catch (err) {
      console.error("❌ REGISTER ERROR:", err);
      setError("Erreur serveur. Veuillez réessayer.");
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('adresse.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        adresse: { ...prev.adresse, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", py: 2 }}>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            width: "100%",
            maxWidth: 450,
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
            sx={{ textDecoration: "underline", textUnderlineOffset: "5px" }}
          >
            ParaVital
          </Typography>

          {/* Titre */}
          <Typography variant="h5" component="h1" fontWeight="600" textAlign="center">
            Créer un compte
          </Typography>

          {/* Champs Nom/Prénom */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              label="Nom"
              fullWidth
              required
              disabled={isLoading}
            />
            <TextField
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              label="Prénom"
              fullWidth
              required
              disabled={isLoading}
            />
          </Box>

          {/* Email */}
          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            type="email"
            fullWidth
            required
            disabled={isLoading}
            autoComplete="email"
            autoFocus
          />

          {/* Téléphone */}
          <TextField
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            label="Téléphone"
            fullWidth
            required
            disabled={isLoading}
          />

          {/* Mot de passe */}
          <TextField
            name="motDePasse"
            value={formData.motDePasse}
            onChange={handleChange}
            label="Mot de passe"
            type="password"
            fullWidth
            required
            disabled={isLoading}
            autoComplete="new-password"
          />

          {/* Adresse */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Adresse (optionnelle)
            </Typography>
          </Divider>

          <TextField
            name="adresse.rue"
            value={formData.adresse.rue}
            onChange={handleChange}
            label="Rue"
            fullWidth
            disabled={isLoading}
          />
          
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              name="adresse.ville"
              value={formData.adresse.ville}
              onChange={handleChange}
              label="Ville"
              fullWidth
              disabled={isLoading}
            />
            <TextField
              name="adresse.codePostal"
              value={formData.adresse.codePostal}
              onChange={handleChange}
              label="Code postal"
              fullWidth
              disabled={isLoading}
            />
          </Box>

          {/* Bouton */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
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
                <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
                Création du compte...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>

          {/* Erreur */}
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}

          {/* Lien login */}
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Déjà un compte ?{" "}
            <Button 
              href="/login" 
              sx={{ 
                color: "#3E5F44", 
                fontWeight: 500, 
                p: 0, 
                minWidth: "auto",
                textTransform: "none"
              }}
            >
              Se connecter
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;