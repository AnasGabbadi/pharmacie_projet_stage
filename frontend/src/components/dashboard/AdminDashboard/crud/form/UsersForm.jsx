import {
  Button, Stack, TextField, Box, Typography, Paper,
  FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../../hooks/useAuth";        
import usersApi from "../../../../../api/users";  // ✅ À créer

function UsersForm({ initialData = null, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nom: initialData?.nom || "",
    email: initialData?.email || "",
    motDePasse: "",  // ✅ Seulement création
    role: initialData?.role || "manager",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token: authToken } = useAuth();
  const token = authToken || localStorage.getItem("token");

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!form.nom.trim()) newErrors.nom = "Nom requis";
    if (!form.email.trim()) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email invalide";
    
    if (!initialData && !form.motDePasse) newErrors.motDePasse = "Mot de passe requis";
    else if (form.motDePasse && form.motDePasse.length < 8) newErrors.motDePasse = "Min 8 caractères";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!token) {
      alert("🔐 Session expirée");
      window.location.href = "/login";
      return;
    }

    setIsSubmitting(true);

    try {
      const id = initialData?._id || initialData?.id;

      if (id) {
        // ✅ UPDATE (sans mot de passe)
        const updateData = { nom: form.nom.trim(), email: form.email.trim() };
        const response = await usersApi.updateUser(id, updateData, token);
        
        if (response && (response.success || response._id || !response.error)) {
          onClose();
          onSuccess?.();
          return;
        }
        throw new Error(response?.message || "Erreur mise à jour");
      } else {
        // ✅ CREATE Manager
        const response = await usersApi.createManager(form, token);
        
        if (response && (response.success || response._id || !response.error)) {
          onClose();
          onSuccess?.();
          return;
        }
        throw new Error(response?.message || "Erreur création");
      }
    } catch (error) {
      console.error("❌ Erreur user:", error);
      setErrors({ submit: error.message || "Erreur serveur" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        nom: initialData.nom || "",
        email: initialData.email || "",
        role: initialData.role || "manager",
      });
      setErrors({});
    }
  }, [initialData]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {errors.submit && (
          <Alert severity="error" onClose={() => setErrors({})}>
            {errors.submit}
          </Alert>
        )}

        <TextField
          label="Nom complet"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth required
          error={!!errors.nom}
          helperText={errors.nom}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth required
          error={!!errors.email}
          helperText={errors.email}
        />

        {!initialData && (
          <TextField
            label="Mot de passe"
            name="motDePasse"
            type="password"
            value={form.motDePasse}
            onChange={handleChange}
            fullWidth required
            error={!!errors.motDePasse}
            helperText={errors.motDePasse}
          />
        )}

        <FormControl fullWidth>
          <InputLabel>Rôle</InputLabel>
          <Select name="role" value={form.role} label="Rôle" onChange={handleChange}>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              flex: 2, borderRadius: 2,
              backgroundColor: "#3E5F44",
              "&:hover": { backgroundColor: "#2f4734" },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {initialData ? "Modification..." : "Création..."}
              </>
            ) : (
              initialData ? "Modifier" : "Créer Manager"
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default UsersForm;