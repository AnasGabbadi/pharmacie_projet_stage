import {
  Button,
  Stack,
  TextField,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState } from "react";
import {
  adminCreateCategorie,
  adminUpdateCategorie,
} from "../../../../services/categoriesAdminApi";

function CategorieForm({ initialData = null, onClose }) {
  const [form, setForm] = useState({
    nom: initialData?.nom || "",
    description: initialData?.description || "",
    slug: initialData?.slug || "",
    active: initialData?.active ?? true,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleActive = (e) => {
    setForm((prev) => ({ ...prev, active: e.target.checked }));
  };

  const handleSubmit = async () => {
    // On envoie du JSON simple (pas de FormData car pas d'image)
    const data = {
      nom: form.nom,
      description: form.description,
      slug: form.slug,
      active: form.active,
    };

    const id = initialData?._id || initialData?.id;

    if (id) {
      await adminUpdateCategorie(id, data);
    } else {
      await adminCreateCategorie(data);
    }

    onClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <TextField
          label="Nom de la catégorie"
          name="nom"
          value={form.nom}
          onChange={handleChange}
          fullWidth
          required
        />

        <TextField
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          fullWidth
          placeholder="ex: soins-visage"
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />

        <FormControlLabel
          control={<Switch checked={form.active} onChange={handleToggleActive} />}
          label="Catégorie active"
        />

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
            {initialData ? "Modifier la catégorie" : "Ajouter la catégorie"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default CategorieForm;