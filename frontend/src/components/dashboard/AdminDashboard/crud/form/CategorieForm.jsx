import {
  Button,
  Stack,
  TextField,
  Box,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../../../hooks/useAuth";       
import categoriesApi from "../../../../../api/categories"; 

function CategorieForm({ initialData = null, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nom: initialData?.nom || "",
    description: initialData?.description || "",
    slug: initialData?.slug || "",
    active: initialData?.active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token: authToken } = useAuth();
  const token = authToken || localStorage.getItem("token");

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!form.nom.trim()) newErrors.nom = "Nom de catégorie requis";
    if (form.nom.trim().length < 2) newErrors.nom = "Minimum 2 caractères";
    if (!form.slug.trim()) newErrors.slug = "Slug requis";
    if (!/^[a-z0-9-]+$/.test(form.slug.trim())) {
      newErrors.slug = "Slug invalide (a-z, 0-9, -)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleActive = (e) => {
    setForm((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!token) {
      alert("🔐 Session expirée");
      window.location.href = "/login";
      return;
    }

    console.log("🚀 CATEGORIE SUBMIT - Token OK, ID:", initialData?._id);

    setIsSubmitting(true);

    try {
      const data = {
        nom: form.nom.trim(),
        description: form.description.trim(),
        slug: form.slug.trim(),
        active: form.active,
      };

      console.log("📤 CATEGORIE DATA:", data);

      const id = initialData?._id || initialData?.id;

      if (id) {
        // ✅ UPDATE
        console.log("🔄 UPDATE Catégorie:", id);
        const response = await categoriesApi.updateCategorie(id, data, token);
        console.log("🔍 UPDATE Response:", response);
        
        if (response && (response._id || response.id || !response.error)) {
          console.log("✅ UPDATE Catégorie Succès !");
          onSuccess?.(response);
          onClose();
          return;
        }
        throw new Error(response?.message || response?.error || "Erreur mise à jour");
      } else {
        // ✅ CREATE - FIX universel
        console.log("➕ CREATE Catégorie");
        const response = await categoriesApi.createCategorie(data, token);
        console.log("🔍 CREATE Response:", response);
        
        // ✅ FIX : Logique universelle (comme UPDATE)
        if (response && (response.success || response._id || response.id || !response.error)) {
          console.log("✅ CREATE Catégorie Succès !");
          onSuccess?.(response);
          onClose();
          return;
        }
        throw new Error(response?.message || response?.error || "Erreur création");
      }
    } catch (error) {
      console.error("❌ Erreur catégorie:", error);
      setErrors({ submit: error.message || "Erreur serveur" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        nom: initialData.nom || "",
        description: initialData.description || "",
        slug: initialData.slug || "",
        active: initialData.active ?? true,
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
          label="Nom de la catégorie"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth required
          error={!!errors.nom}
          helperText={errors.nom}
        />

        <TextField
          label="Slug (URL)"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          fullWidth
          placeholder="ex: soins-visage"
          error={!!errors.slug}
          helperText={errors.slug || "Utilisé dans les URLs"}
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth multiline rows={3}
        />

        <FormControlLabel
          control={<Switch checked={form.active} onChange={handleToggleActive} />}
          label="Catégorie active"
        />

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
              flex: 2,
              borderRadius: 2,
              backgroundColor: "#3E5F44",
              "&:hover": { backgroundColor: "#2f4734" },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {initialData ? "Modification..." : "Ajout..."}
              </>
            ) : (
              initialData ? "Modifier la catégorie" : "Ajouter la catégorie"
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default CategorieForm;