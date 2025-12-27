// src/components/layout/SearchBar.jsx
import { useState } from "react";
import { InputBase, Paper, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produits?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: 3,
        border: "2px solid #e0e0e0",
        backgroundColor: "#f8f9fa",
        px: 2,
        py: 0.5,
        "&:focus-within": {
          borderColor: "#3E5F44",
          backgroundColor: "white",
        },
        transition: "all 0.2s ease",
      }}
      elevation={0}
    >
      <Search sx={{ color: "#999", mr: 1 }} />
      <InputBase
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          flex: 1,
          fontSize: "0.95rem",
        }}
      />
      <IconButton type="submit" sx={{ p: 0.5 }}>
        <Search sx={{ color: "#3E5F44" }} />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
