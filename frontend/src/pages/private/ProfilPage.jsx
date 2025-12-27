import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Avatar,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Person, Lock, Email, Badge } from "@mui/icons-material";
import { getProfilAdmin, updatePasswordAdmin, updateProfilAdmin } from "../../services/profilAdminApi";

function ProfilPage() {
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formInfo, setFormInfo] = useState({
    nom: "",
    email: "",
  });
  const [formPassword, setFormPassword] = useState({
    ancienMotDePasse: "",
    nouveauMotDePasse: "",
    confirmMotDePasse: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await getProfilAdmin();
        setProfil(res);
        setFormInfo({
          nom: res.nom || "",
          email: res.email || "",
        });
      } catch (err) {
        console.error(err);
        setErrorMessage("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfil();
  }, []);

  const handleInfoChange = (e) => {
    setFormInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setFormPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateInfo = async () => {
    try {
      setLoadingInfo(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!formInfo.nom || !formInfo.email) {
        setErrorMessage("Nom et email sont requis");
        return;
      }

      await updateProfilAdmin(formInfo);
      setSuccessMessage("Informations mises à jour avec succès");
      const res = await getProfilAdmin();
      setProfil(res);
    } catch (err) {
      setErrorMessage(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoadingInfo(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setLoadingPassword(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (
        !formPassword.ancienMotDePasse ||
        !formPassword.nouveauMotDePasse ||
        !formPassword.confirmMotDePasse
      ) {
        setErrorMessage("Tous les champs sont requis");
        return;
      }

      if (formPassword.nouveauMotDePasse !== formPassword.confirmMotDePasse) {
        setErrorMessage("Les mots de passe ne correspondent pas");
        return;
      }

      if (formPassword.nouveauMotDePasse.length < 6) {
        setErrorMessage("Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      await updatePasswordAdmin({
        ancienMotDePasse: formPassword.ancienMotDePasse,
        nouveauMotDePasse: formPassword.nouveauMotDePasse,
      });

      setSuccessMessage("Mot de passe modifié avec succès");
      setFormPassword({
        ancienMotDePasse: "",
        nouveauMotDePasse: "",
        confirmMotDePasse: "",
      });
    } catch (err) {
      setErrorMessage(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoadingPassword(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#3E5F44" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        p: { xs: 2, sm: 4 },
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.8rem" },
          }}
        >
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Profil / </span>
          Mon compte
        </Typography>
      </Stack>

      {/* Messages */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      )}

      <Stack spacing={3}>
        {/* Carte Résumé */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
            color: "white",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "white",
                color: "#3E5F44",
                fontSize: "2rem",
                fontWeight: 700,
              }}
            >
              {profil?.nom?.charAt(0).toUpperCase() || "A"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
                {profil?.nom || "Administrateur"}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Email fontSize="small" />
                <Typography variant="body1">{profil?.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                <Badge fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {profil?.role || "Admin"}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Carte Informations personnelles */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#3E5F44",
              }}
            >
              <Person />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Informations personnelles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modifier votre nom et email
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <TextField
              label="Nom complet"
              name="nom"
              value={formInfo.nom}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Adresse email"
              name="email"
              type="email"
              value={formInfo.email}
              onChange={handleInfoChange}
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleUpdateInfo}
              disabled={loadingInfo}
              sx={{
                backgroundColor: "#3E5F44",
                "&:hover": { backgroundColor: "#2f4734" },
                borderRadius: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {loadingInfo ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </Stack>
        </Paper>

        {/* Carte Mot de passe */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: "#f44336",
              }}
            >
              <Lock />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Sécurité du compte
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modifier votre mot de passe
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            <TextField
              label="Ancien mot de passe"
              name="ancienMotDePasse"
              type="password"
              value={formPassword.ancienMotDePasse}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Nouveau mot de passe"
              name="nouveauMotDePasse"
              type="password"
              value={formPassword.nouveauMotDePasse}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
              helperText="Minimum 6 caractères"
            />
            <TextField
              label="Confirmer le nouveau mot de passe"
              name="confirmMotDePasse"
              type="password"
              value={formPassword.confirmMotDePasse}
              onChange={handlePasswordChange}
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              disabled={loadingPassword}
              sx={{
                backgroundColor: "#f44336",
                "&:hover": { backgroundColor: "#d32f2f" },
                borderRadius: 2,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {loadingPassword ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Changer le mot de passe"
              )}
            </Button>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}

export default ProfilPage;