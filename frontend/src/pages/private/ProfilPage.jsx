import { useEffect, useState } from "react";
import {
  Box, Stack, Typography, TextField, Button, Paper, Alert,
  Avatar, Divider, CircularProgress, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Checkbox, FormControlLabel, IconButton,
} from "@mui/material";
import { Person, Lock, Email, Badge, Phone, LocationOn, Add, Edit, Delete, Star } from "@mui/icons-material";
import authService from "../../api/auth";

function ProfilPage() {
  const role     = localStorage.getItem("role");   // "admin" | "client"
  const isClient = role === "client";

  const [loading, setLoading] = useState(true);

  // ── Formulaire infos ──────────────────────────────────────
  const [formInfo, setFormInfo] = useState({
    nom: "", prenom: "", email: "", telephone: "",
  });
  const [formErrors,  setFormErrors]  = useState({});
  const [loadingInfo, setLoadingInfo] = useState(false);

  // ── Formulaire mot de passe ───────────────────────────────
  const [formPassword, setFormPassword] = useState({
    ancienMotDePasse: "", nouveauMotDePasse: "", confirmMotDePasse: "",
  });
  const [pwErrors,         setPwErrors]         = useState({});
  const [loadingPassword,  setLoadingPassword]  = useState(false);

  // ── Adresses ──────────────────────────────────────────────
  const [adresses,        setAdresses]        = useState([]);
  const [loadingAdresses, setLoadingAdresses] = useState(true);

  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress,    setEditingAddress]    = useState(null); // null = ajout, objet = édition
  const [addressForm, setAddressForm] = useState({
    rue: "", ville: "", codePostal: "", pays: "Maroc", estPrincipale: false,
  });
  const [addressFormErrors, setAddressFormErrors] = useState({});
  const [addressDialogError, setAddressDialogError] = useState("");
  const [savingAddress,     setSavingAddress]     = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  // ── Alertes ───────────────────────────────────────────────
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage,   setErrorMessage]   = useState("");

  const showSuccess = (msg) => { setSuccessMessage(msg); setTimeout(() => setSuccessMessage(""), 4000); };
  const showError   = (msg) => { setErrorMessage(msg);   setTimeout(() => setErrorMessage(""),   4000); };

  const setInfoField = (field, value) => {
    setFormInfo((p)   => ({ ...p, [field]: value }));
    setFormErrors((p) => ({ ...p, [field]: undefined }));
  };
  const setPwField = (field, value) => {
    setFormPassword((p) => ({ ...p, [field]: value }));
    setPwErrors((p)     => ({ ...p, [field]: undefined }));
  };

  // ── Fetch profil via GET /api/auth/me ─────────────────────
  useEffect(() => {
    const fetchProfil = async () => {
      setLoading(true);
      try {
        // authService.getProfile() appelle GET /api/auth/me
        const res  = await authService.getProfile();
        console.log("📡 GET /auth/me réponse:", res);

        // Le backend retourne { success, data: { nom, prenom, email, telephone, role } }
        const data = res?.data || res;

        setFormInfo({
          nom:       data?.nom       || data?.name || "",
          prenom:    data?.prenom    || "",
          email:     data?.email     || "",
          telephone: data?.telephone || "",
        });
      } catch (err) {
        console.error("❌ fetchProfil error:", err);
        showError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  // ── Fetch adresses via GET /api/auth/me/adresses (client uniquement) ──
  const fetchAdresses = async () => {
    setLoadingAdresses(true);
    try {
      const res = await authService.getAdresses();
      if (res?.success) {
        setAdresses(res.data || []);
      } else {
        showError(res?.message || "Erreur lors du chargement des adresses");
      }
    } catch (err) {
      showError(err.message || "Erreur lors du chargement des adresses");
    } finally {
      setLoadingAdresses(false);
    }
  };

  useEffect(() => {
    if (isClient) fetchAdresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Dialog adresse : ouverture / fermeture ────────────────
  const openAddDialog = () => {
    setEditingAddress(null);
    setAddressForm({ rue: "", ville: "", codePostal: "", pays: "Maroc", estPrincipale: false });
    setAddressFormErrors({});
    setAddressDialogError("");
    setAddressDialogOpen(true);
  };

  const openEditDialog = (adresse) => {
    setEditingAddress(adresse);
    setAddressForm({
      rue: adresse.rue || "",
      ville: adresse.ville || "",
      codePostal: adresse.codePostal || "",
      pays: adresse.pays || "Maroc",
      estPrincipale: !!adresse.estPrincipale,
    });
    setAddressFormErrors({});
    setAddressDialogError("");
    setAddressDialogOpen(true);
  };

  const closeAddressDialog = () => {
    if (savingAddress) return;
    setAddressDialogOpen(false);
  };

  const setAddressField = (field, value) => {
    setAddressForm((p) => ({ ...p, [field]: value }));
    setAddressFormErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validateAddressForm = () => {
    const e = {};
    if (!addressForm.rue.trim()) e.rue = "Rue obligatoire";
    if (!addressForm.ville.trim()) e.ville = "Ville obligatoire";
    setAddressFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;
    setSavingAddress(true);
    setAddressDialogError("");

    try {
      const payload = {
        rue: addressForm.rue.trim(),
        ville: addressForm.ville.trim(),
        codePostal: addressForm.codePostal.trim(),
        pays: addressForm.pays.trim() || "Maroc",
        estPrincipale: addressForm.estPrincipale,
      };

      const res = editingAddress
        ? await authService.updateAdresse(editingAddress._id, payload)
        : await authService.addAdresse(payload);

      if (res?.success) {
        setAdresses(res.data || []);
        setAddressDialogOpen(false);
        showSuccess(editingAddress ? "Adresse modifiée avec succès" : "Adresse ajoutée avec succès");
      } else {
        setAddressDialogError(res?.message || "Erreur lors de l'enregistrement de l'adresse");
      }
    } catch (err) {
      setAddressDialogError(err.message || "Erreur lors de l'enregistrement de l'adresse");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (adresse) => {
    const confirmed = window.confirm(
      `Supprimer l'adresse "${adresse.rue}, ${adresse.ville}" ?`
    );
    if (!confirmed) return;

    setDeletingAddressId(adresse._id);
    try {
      const res = await authService.deleteAdresse(adresse._id);
      if (res?.success) {
        setAdresses(res.data || []);
        showSuccess("Adresse supprimée avec succès");
      } else {
        showError(res?.message || "Erreur lors de la suppression de l'adresse");
      }
    } catch (err) {
      showError(err.message || "Erreur lors de la suppression de l'adresse");
    } finally {
      setDeletingAddressId(null);
    }
  };

  // ── Validation infos ──────────────────────────────────────
  const validateInfo = () => {
    const e = {};
    if (!formInfo.nom.trim())
      e.nom = "Nom obligatoire";
    if (isClient && !formInfo.prenom.trim())
      e.prenom = "Prénom obligatoire";
    if (!formInfo.email.trim())
      e.email = "Email obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInfo.email))
      e.email = "Email invalide";
    if (isClient && formInfo.telephone.trim() &&
        !/^(\+212|0)[5-7][0-9]{8}$/.test(formInfo.telephone.replace(/\s/g, "")))
      e.telephone = "Format invalide (ex: 0661234567)";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Update infos via PUT /api/auth/me ─────────────────────
  const handleUpdateInfo = async () => {
    if (!validateInfo()) return;
    setLoadingInfo(true);

    try {
      const payload = isClient
        ? {
            nom:       formInfo.nom.trim(),
            prenom:    formInfo.prenom.trim(),
            email:     formInfo.email.trim().toLowerCase(),
            telephone: formInfo.telephone.trim(),
          }
        : {
            nom:   formInfo.nom.trim(),
            email: formInfo.email.trim().toLowerCase(),
          };

      const response = await authService.updateProfile(payload);
      console.log("📝 PUT /auth/me réponse:", response);

      if (response?.success) {
        showSuccess("✅ Informations mises à jour avec succès");
        // Rafraîchir les données affichées
        const updated = response?.data || {};
        setFormInfo((p) => ({
          ...p,
          nom:       updated.nom       || p.nom,
          prenom:    updated.prenom    || p.prenom,
          email:     updated.email     || p.email,
          telephone: updated.telephone || p.telephone,
        }));
      } else {
        throw new Error(response?.message || "Erreur mise à jour");
      }
    } catch (err) {
      showError(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoadingInfo(false);
    }
  };

  // ── Validation mot de passe ───────────────────────────────
  const validatePassword = () => {
    const e = {};
    if (!formPassword.ancienMotDePasse)
      e.ancienMotDePasse = "Ancien mot de passe requis";
    if (!formPassword.nouveauMotDePasse)
      e.nouveauMotDePasse = "Nouveau mot de passe requis";
    else if (formPassword.nouveauMotDePasse.length < 6)
      e.nouveauMotDePasse = "Minimum 6 caractères";
    if (!formPassword.confirmMotDePasse)
      e.confirmMotDePasse = "Confirmation requise";
    else if (formPassword.nouveauMotDePasse !== formPassword.confirmMotDePasse)
      e.confirmMotDePasse = "Les mots de passe ne correspondent pas";
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Update password via PUT /api/auth/password ────────────
  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;
    setLoadingPassword(true);

    try {
      // authService.updatePassword() appelle PUT /api/auth/password
      const response = await authService.updatePassword({
        ancienMotDePasse:  formPassword.ancienMotDePasse,
        nouveauMotDePasse: formPassword.nouveauMotDePasse,
      });
      console.log("🔒 PUT /auth/password réponse:", response);

      if (response?.success) {
        showSuccess("Mot de passe modifié avec succès");
        setFormPassword({ ancienMotDePasse: "", nouveauMotDePasse: "", confirmMotDePasse: "" });
        setPwErrors({});
      } else {
        throw new Error(response?.message || "Erreur changement mot de passe");
      }
    } catch (err) {
      showError(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setLoadingPassword(false);
    }
  };

  // ── Initiales avatar ──────────────────────────────────────
  const initiales = isClient
    ? `${formInfo.nom?.[0] || ""}${formInfo.prenom?.[0] || ""}`.toUpperCase() || "C"
    : formInfo.nom?.[0]?.toUpperCase() || "A";

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
        <CircularProgress sx={{ color: "#3E5F44" }} />
        <Typography color="text.secondary">Chargement du profil...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "auto", p: { xs: 2, sm: 4 } }}>

      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontSize: { xs: "1.2rem", sm: "1.8rem" } }}>
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Profil / </span>
          Mon compte
        </Typography>
        <Chip
          label={isClient ? "Client" : "Administrateur"}
          size="small"
          sx={{
            backgroundColor: isClient ? "#e8f5e9" : "#fff3e0",
            color: isClient ? "#3E5F44" : "#e65100",
            fontWeight: 700,
          }}
        />
      </Stack>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setErrorMessage("")}>
          {errorMessage}
        </Alert>
      )}

      <Stack spacing={3}>

        {/* ── Carte identité ── */}
        <Paper elevation={2} sx={{
          p: 4, borderRadius: 3,
          background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
          color: "white",
        }}>
          <Stack direction="row" alignItems="center" spacing={3} flexWrap="wrap" gap={2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "white", color: "#3E5F44", fontSize: "1.8rem", fontWeight: 700 }}>
              {initiales}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700} mb={0.5}>
                {isClient
                  ? `${formInfo.nom} ${formInfo.prenom}`.trim() || "Client"
                  : formInfo.nom || "Administrateur"
                }
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                <Email fontSize="small" />
                <Typography variant="body2">{formInfo.email || "—"}</Typography>
              </Stack>
              {isClient && formInfo.telephone && (
                <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Phone fontSize="small" />
                  <Typography variant="body2">{formInfo.telephone}</Typography>
                </Stack>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
                <Badge fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.85 }}>{role}</Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* ── Informations personnelles ── */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: "#3E5F44" }}><Person /></Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>Informations personnelles</Typography>
              <Typography variant="body2" color="text.secondary">
                {isClient ? "Nom, prénom, email et téléphone" : "Nom et email"}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2.5}>
            {/* Nom + Prénom (client) ou Nom seul (admin) */}
            {isClient ? (
              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <TextField
                  label="Nom *"
                  value={formInfo.nom}
                  onChange={(e) => setInfoField("nom", e.target.value)}
                  error={!!formErrors.nom}
                  helperText={formErrors.nom}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  label="Prénom *"
                  value={formInfo.prenom}
                  onChange={(e) => setInfoField("prenom", e.target.value)}
                  error={!!formErrors.prenom}
                  helperText={formErrors.prenom}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
              </Stack>
            ) : (
              <TextField
                label="Nom complet *"
                value={formInfo.nom}
                onChange={(e) => setInfoField("nom", e.target.value)}
                error={!!formErrors.nom}
                helperText={formErrors.nom}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            )}

            <TextField
              label="Adresse email *"
              type="email"
              value={formInfo.email}
              onChange={(e) => setInfoField("email", e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            {/* Téléphone — client uniquement */}
            {isClient && (
              <TextField
                label="Téléphone"
                value={formInfo.telephone}
                onChange={(e) => setInfoField("telephone", e.target.value)}
                error={!!formErrors.telephone}
                helperText={formErrors.telephone || "Format: 0661234567 ou +212661234567"}
                fullWidth
                placeholder="Ex: 0661234567"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            )}

            <Button
              variant="contained"
              onClick={handleUpdateInfo}
              disabled={loadingInfo}
              fullWidth
              sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, borderRadius: 2, py: 1.5, textTransform: "none", fontSize: "1rem" }}
            >
              {loadingInfo
                ? <CircularProgress size={24} sx={{ color: "white" }} />
                : "Enregistrer les modifications"
              }
            </Button>
          </Stack>
        </Paper>

        {/* ── Mes adresses (client uniquement) ── */}
        {isClient && (
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" spacing={2} mb={3}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ width: 50, height: 50, bgcolor: "#3E5F44" }}><LocationOn /></Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>Mes adresses</Typography>
                  <Typography variant="body2" color="text.secondary">Gérez vos adresses de livraison</Typography>
                </Box>
              </Stack>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={openAddDialog}
                sx={{
                  borderColor: "#3E5F44", color: "#3E5F44", textTransform: "none", borderRadius: 2,
                  "&:hover": { borderColor: "#2f4734", backgroundColor: "#f0f7f1" },
                }}
              >
                Ajouter une adresse
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {loadingAdresses ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={28} sx={{ color: "#3E5F44" }} />
              </Box>
            ) : adresses.length === 0 ? (
              <Typography color="text.secondary" sx={{ py: 1 }}>
                Aucune adresse enregistrée pour le moment.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {adresses.map((adresse) => (
                  <Paper
                    key={adresse._id}
                    variant="outlined"
                    sx={{
                      p: 2.5, borderRadius: 2,
                      borderColor: adresse.estPrincipale ? "#3E5F44" : "#e0e0e0",
                      borderWidth: adresse.estPrincipale ? 2 : 1,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap">
                          <Typography fontWeight={600}>{adresse.rue}</Typography>
                          {adresse.estPrincipale && (
                            <Chip
                              icon={<Star sx={{ fontSize: 16 }} />}
                              label="Principale"
                              size="small"
                              sx={{ backgroundColor: "#e8f5e9", color: "#3E5F44", fontWeight: 700 }}
                            />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {adresse.ville}{adresse.codePostal ? `, ${adresse.codePostal}` : ""} — {adresse.pays}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => openEditDialog(adresse)} sx={{ color: "#3E5F44" }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteAddress(adresse)}
                          disabled={deletingAddressId === adresse._id}
                          sx={{ color: "#e74c3c", "&:hover": { backgroundColor: "#fdecea" } }}
                        >
                          {deletingAddressId === adresse._id
                            ? <CircularProgress size={18} color="error" />
                            : <Delete fontSize="small" />
                          }
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        )}

        {/* ── Sécurité / Mot de passe ── */}
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, backgroundColor: "#fff" }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ width: 50, height: 50, bgcolor: "#f44336" }}><Lock /></Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>Sécurité du compte</Typography>
              <Typography variant="body2" color="text.secondary">Modifier votre mot de passe</Typography>
            </Box>
          </Stack>
          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2.5}>
            {[
              { key: "ancienMotDePasse",  label: "Ancien mot de passe *",               helper: "" },
              { key: "nouveauMotDePasse", label: "Nouveau mot de passe *",               helper: "Minimum 6 caractères" },
              { key: "confirmMotDePasse", label: "Confirmer le nouveau mot de passe *",  helper: "" },
            ].map(({ key, label, helper }) => (
              <TextField
                key={key}
                label={label}
                type="password"
                value={formPassword[key]}
                onChange={(e) => setPwField(key, e.target.value)}
                error={!!pwErrors[key]}
                helperText={pwErrors[key] || helper}
                fullWidth
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            ))}

            <Button
              variant="contained"
              onClick={handleUpdatePassword}
              disabled={loadingPassword}
              fullWidth
              sx={{ backgroundColor: "#f44336", "&:hover": { backgroundColor: "#d32f2f" }, borderRadius: 2, py: 1.5, textTransform: "none", fontSize: "1rem" }}
            >
              {loadingPassword
                ? <CircularProgress size={24} sx={{ color: "white" }} />
                : "Changer le mot de passe"
              }
            </Button>
          </Stack>
        </Paper>

      </Stack>

      {/* ── Dialog Ajouter / Modifier une adresse ── */}
      <Dialog
        open={addressDialogOpen}
        onClose={closeAddressDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingAddress ? "Modifier l'adresse" : "Ajouter une adresse"}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {addressDialogError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{addressDialogError}</Alert>
          )}
          <Stack gap={2} mt={1}>
            <TextField
              label="Rue / Adresse complète *"
              value={addressForm.rue}
              onChange={(e) => setAddressField("rue", e.target.value)}
              error={!!addressFormErrors.rue}
              helperText={addressFormErrors.rue}
              fullWidth
              placeholder="Ex: 12 Rue Mohammed V, Apt 3"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <Stack direction="row" gap={2}>
              <TextField
                label="Ville *"
                value={addressForm.ville}
                onChange={(e) => setAddressField("ville", e.target.value)}
                error={!!addressFormErrors.ville}
                helperText={addressFormErrors.ville}
                fullWidth
                placeholder="Ex: Casablanca"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                label="Code postal"
                value={addressForm.codePostal}
                onChange={(e) => setAddressField("codePostal", e.target.value)}
                fullWidth
                placeholder="Ex: 20000"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Stack>
            <TextField
              label="Pays"
              value={addressForm.pays}
              onChange={(e) => setAddressField("pays", e.target.value)}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={addressForm.estPrincipale}
                  onChange={(e) => setAddressField("estPrincipale", e.target.checked)}
                  sx={{ color: "#3E5F44", "&.Mui-checked": { color: "#3E5F44" } }}
                />
              }
              label="Définir comme adresse principale"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={closeAddressDialog} disabled={savingAddress} sx={{ color: "text.secondary", textTransform: "none" }}>
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAddress}
            disabled={savingAddress}
            sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, textTransform: "none", borderRadius: 2, minWidth: 100 }}
          >
            {savingAddress
              ? <CircularProgress size={22} sx={{ color: "white" }} />
              : (editingAddress ? "Enregistrer" : "Ajouter")
            }
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ProfilPage;