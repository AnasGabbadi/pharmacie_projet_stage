import { useState, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import { useProduits } from "../../hooks/useProduits";
import { useCategories } from "../../hooks/useCategories";

const LIMITE = 12;

const focusSx = {
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#3E5F44",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#3E5F44",
  },
};

function ProductSearchSection() {
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [categorie, setCategorie] = useState("");
  const [prixMin, setPrixMin] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [page, setPage] = useState(1);

  const { categories } = useCategories();

  // Debounce de la recherche texte (300-400ms) pour ne pas spammer l'API.
  useEffect(() => {
    const timer = setTimeout(() => setQ(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Tout changement de filtre ou de recherche ramène à la page 1.
  useEffect(() => {
    setPage(1);
  }, [q, categorie, prixMin, prixMax, disponibilite]);

  const params = useMemo(
    () => ({
      q: q || undefined,
      categorie: categorie || undefined,
      prixMin: prixMin || undefined,
      prixMax: prixMax || undefined,
      disponibilite: disponibilite || undefined,
      page,
      limite: LIMITE,
    }),
    [q, categorie, prixMin, prixMax, disponibilite, page]
  );

  const { data: produits, pagination, loading, error } = useProduits(params);

  const produitsAffiches = produits.map((p) => ({ ...p, image: p.imageUrl }));

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Tous nos produits</h2>

        {/* Barre de recherche + filtres */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            ...focusSx,
          }}
        >
          <TextField
            placeholder="Rechercher un produit..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            size="small"
            sx={{ flex: "1 1 260px" }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: "#9e9e9e" }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Catégorie"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">Toutes catégories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.nom}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Prix min"
            type="number"
            value={prixMin}
            onChange={(e) => setPrixMin(e.target.value)}
            size="small"
            sx={{ width: 120 }}
          />

          <TextField
            label="Prix max"
            type="number"
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
            size="small"
            sx={{ width: 120 }}
          />

          <TextField
            select
            label="Disponibilité"
            value={disponibilite}
            onChange={(e) => setDisponibilite(e.target.value)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="en_stock">En stock</MenuItem>
            <MenuItem value="rupture">Rupture</MenuItem>
          </TextField>
        </Box>

        {/* Résultats */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={40} sx={{ color: "#3E5F44" }} />
          </Box>
        ) : error ? (
          <Alert severity="error">
            {error.message || "Erreur lors du chargement des produits"}
          </Alert>
        ) : produitsAffiches.length === 0 ? (
          <Alert severity="info">Aucun produit ne correspond à ces critères.</Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {produitsAffiches.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {pagination.pages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  count={pagination.pages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  sx={{
                    "& .MuiPaginationItem-root.Mui-selected": {
                      backgroundColor: "#3E5F44",
                      color: "white",
                    },
                    "& .MuiPaginationItem-root.Mui-selected:hover": {
                      backgroundColor: "#2f4734",
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ProductSearchSection;
