import {
  Button,
  Stack,
  TextField,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../../hooks/useAuth";        
import categoriesApi from "../../../../../api/categories";
import produitsApi from "../../../../../api/produits";         

function ProduitForm({ initialData = null, onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [form, setForm] = useState({
    nom: initialData?.nom || "",
    description: initialData?.description || "",
    prix: initialData?.prix ?? "",
    stock: initialData?.stock ?? 0,
    categorieId: initialData?.categorieId || "",
    actif: initialData?.actif ?? true,
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token: authToken } = useAuth();
  const token = authToken || localStorage.getItem("token");

  // ✅ FETCH CATÉGORIES
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const res = await categoriesApi.getCategories({ actif: null });
      setCategories(res.items || res.data || res || []);
    } catch (error) {
      console.error("❌ Erreur catégories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!form.nom.trim()) newErrors.nom = "Nom requis";
    if (!form.description.trim()) newErrors.description = "Description requise";
    if (!form.prix || form.prix <= 0) newErrors.prix = "Prix valide requis";
    if (form.stock === "" || form.stock < 0) newErrors.stock = "Stock valide requis";
    if (!form.categorieId) newErrors.categorieId = "Catégorie requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "prix" || name === "stock"
        ? value === "" ? "" : Number(value)
        : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleActif = (e) => {
    setForm((prev) => ({ ...prev, actif: e.target.checked }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
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
      const formData = new FormData();
      formData.append("nom", form.nom.trim());
      formData.append("description", form.description.trim());
      formData.append("prix", String(form.prix));
      formData.append("stock", String(form.stock));
      formData.append("categorieId", form.categorieId);
      formData.append("actif", String(form.actif));
      if (file) formData.append("image", file);

      const id = initialData?._id || initialData?.id;

      if (id) {
        // ✅ UPDATE
        const response = await produitsApi.updateProduit(id, formData, token);
        
        if (response && (response._id || response.id || !response.error)) {
          onClose();
          onSuccess?.();
          return;
        }
        throw new Error(response?.message || response?.error || "Erreur mise à jour");
      } else {
        // ✅ CREATE - FIX universel comme UPDATE
        const response = await produitsApi.createProduit(formData, token);
        
        // ✅ FIX : Même logique UPDATE (universelle)
        if (response && (response.success || response._id || response.id || !response.error)) {
          onClose();
          onSuccess?.();
          return;
        }
        throw new Error(response?.message || response?.error || "Erreur création");
      }
    } catch (error) {
      console.error("❌ Erreur produit:", error);
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
        prix: initialData.prix ?? "",
        stock: initialData.stock ?? 0,
        categorieId: initialData.categorieId || "",
        actif: initialData.actif ?? true,
      });
      setFile(null);
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
          label="Nom du produit"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth required
          error={!!errors.nom}
          helperText={errors.nom}
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth multiline rows={4}
          error={!!errors.description}
          helperText={errors.description}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Prix"
            name="prix"
            type="number"
            value={form.prix}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, step: "0.01" }}
            required
            error={!!errors.prix}
            helperText={errors.prix}
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0 }}
            error={!!errors.stock}
            helperText={errors.stock}
          />
        </Stack>

        <FormControl fullWidth error={!!errors.categorieId}>
          <InputLabel>Catégorie</InputLabel>
          <Select
            name="categorieId"
            value={form.categorieId}
            label="Catégorie"
            onChange={handleChange}
            disabled={categoriesLoading}
            required
          >
            {categoriesLoading ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : categories.length === 0 ? (
              <MenuItem disabled>Aucune catégorie</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.nom}
                </MenuItem>
              ))
            )}
          </Select>
          {errors.categorieId && (
            <Typography variant="caption" color="error">
              {errors.categorieId}
            </Typography>
          )}
        </FormControl>

        <FormControlLabel
          control={<Switch checked={form.actif} onChange={handleToggleActif} />}
          label="Produit actif"
        />

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Image du produit
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            disabled={isSubmitting}
            sx={{
              borderRadius: 2,
              borderStyle: "dashed",
              borderWidth: 2,
              py: 2,
              justifyContent: "center",
            }}
          >
            {file ? `✓ ${file.name}` : "📁 Choisir une image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          {file && (
            <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          )}
          {!file && initialData?.imageUrl && (
            <Paper sx={{ mt: 1.5, p: 1 }}>
              <Typography variant="caption" sx={{ display: "block", mb: 0.5 }}>
                Image actuelle
              </Typography>
              <Box
                component="img"
                src={initialData.imageUrl}
                alt={initialData.nom}
                sx={{ width: 80, height: 80, objectFit: "cover", borderRadius: 1 }}
              />
            </Paper>
          )}
        </Box>

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
              initialData ? "Modifier le produit" : "Ajouter le produit"
            )}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ProduitForm;