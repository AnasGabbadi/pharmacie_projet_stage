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
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  adminCreateProduit,
  adminUpdateProduit,
} from "../../../../services/produitsAdminApi";
import { adminGetCategories } from "../../../../services/categoriesAdminApi";

function ProduitForm({ initialData = null, onClose }) {
  const [form, setForm] = useState({
    nom: initialData?.nom || "",
    description: initialData?.description || "",
    prix: initialData?.prix ?? "",
    stock: initialData?.stock ?? 0,
    categorieId: initialData?.categorieId || "",
    actif: initialData?.actif ?? true,
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await adminGetCategories();
        setCategories(res.items || res || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "prix" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleToggleActif = (e) => {
    setForm((prev) => ({ ...prev, actif: e.target.checked }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("nom", form.nom);                   
        formData.append("description", form.description);
        formData.append("prix", String(form.prix || 0));   
        formData.append("stock", String(form.stock || 0));
        if (form.categorieId) formData.append("categorieId", form.categorieId);
        formData.append("actif", String(form.actif));
        if (file) formData.append("image", file);

        const id = initialData?._id || initialData?.id;

        if (id) {
            await adminUpdateProduit(id, formData);
        } else {
            await adminCreateProduit(formData);
        }

        onClose();
    };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <TextField
          label="Nom du produit"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
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
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            fullWidth
            inputProps={{ min: 0, step: "1" }}
          />
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Catégorie</InputLabel>
          <Select
            name="categorieId"
            value={form.categorieId}
            label="Catégorie"
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.nom}
              </MenuItem>
            ))}
          </Select>
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
            sx={{
              borderRadius: 2,
              borderStyle: "dashed",
              borderWidth: 2,
              py: 2,
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
            <Typography
              variant="caption"
              sx={{ mt: 1, display: "block", fontStyle: "italic" }}
            >
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
          )}

          {!file && initialData?.imageUrl && (
            <Paper
              sx={{
                mt: 1.5,
                p: 1,
                display: "inline-block",
              }}
            >
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
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              flex: 2,
              borderRadius: 2,
              backgroundColor: "#3E5F44",
              "&:hover": { backgroundColor: "#2f4734" },
            }}
          >
            {initialData ? "Modifier le produit" : "Ajouter le produit"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ProduitForm;