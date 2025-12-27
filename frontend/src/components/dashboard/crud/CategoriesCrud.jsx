// src/pages/admin/components/categories/CategoriesCrud.jsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, Visibility } from "@mui/icons-material";
import CategorieForm from "./form/CategorieForm";
import {
  adminGetCategories,
  adminDeleteCategorie,
} from "../../../services/categoriesAdminApi";

function CategoriesCrud() {
  const [categories, setCategories] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingCategorie, setEditingCategorie] = useState(null);
  const [viewingCategorie, setViewingCategorie] = useState(null);

  const fetchCategories = async () => {
    const res = await adminGetCategories();
    setCategories(res.items || res || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddClick = () => {
    setEditingCategorie(null);
    setPopupOpen(true);
  };

  const handleEditClick = (categorie) => {
    setEditingCategorie(categorie);
    setPopupOpen(true);
  };

  const handleViewClick = (categorie) => {
    setViewingCategorie(categorie);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await adminDeleteCategorie(id);
      fetchCategories();
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setEditingCategorie(null);
    fetchCategories();
  };

  const handleCloseView = () => {
    setViewingCategorie(null);
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          padding: { xs: "12px 16px", sm: "16px 24px" },
        }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.8rem" },
          }}
        >
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>
            Catégories /{" "}
          </span>
          Liste des catégories
        </Typography>

        <IconButton
          onClick={handleAddClick}
          sx={{
            color: "white",
            backgroundColor: "#3E5F44",
            "&:hover": {
              backgroundColor: "#2f4734",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease",
            borderRadius: "999px",
            px: 2,
            gap: 1,
          }}
        >
          <Add fontSize="small" />
          <Typography variant="button" sx={{ textTransform: "none" }}>
            Ajouter
          </Typography>
        </IconButton>
      </Stack>

      {/* DataGrid */}
      <Box
        sx={{
          flexGrow: 1,
          padding: { xs: "8px", sm: "16px" },
          minHeight: 0,
        }}
      >
        <DataGrid
          rows={categories}
          columns={[
            {
              field: "nom",
              headerName: "Nom",
              flex: 1,
              minWidth: 150,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "description",
              headerName: "Description",
              flex: 1.5,
              minWidth: 220,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "slug",
              headerName: "Slug",
              flex: 1,
              minWidth: 120,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "active",
              headerName: "Actif",
              width: 90,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
              renderCell: (params) => (
                <Typography
                  variant="body2"
                  sx={{
                    color: params.value ? "#2e7d32" : "#d32f2f",
                    fontWeight: 500,
                  }}
                >
                  {params.value ? "Oui" : "Non"}
                </Typography>
              ),
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 180,
              sortable: false,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
              renderCell: (params) => (
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#2196f3",
                      backgroundColor: "rgba(33, 150, 243, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(33, 150, 243, 0.2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleViewClick(params.row)}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#3E5F44",
                      backgroundColor: "rgba(62, 95, 68, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(62, 95, 68, 0.2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleEditClick(params.row)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      color: "#f44336",
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.2)",
                        transform: "scale(1.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() =>
                      handleDeleteClick(params.row._id || params.row.id)
                    }
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              ),
            },
          ]}
          getRowId={(row) => row._id || row.id}
          sx={{
            height: "100%",
            border: "none",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            backgroundColor: "white",
            "& .custom-header": {
              backgroundColor: "#f5f5f5",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#333",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderRadius: "8px 8px 0 0",
              borderBottom: "2px solid #e0e0e0",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: "#f8f9fa",
                cursor: "pointer",
              },
              "&:nth-of-type(even)": {
                backgroundColor: "#fafafa",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight={false}
        />
      </Box>

      {/* Dialog formulaire (Create/Edit) */}
      <Dialog
        open={popupOpen}
        onClose={handleClosePopup}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
            color: "white",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {editingCategorie ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <CategorieForm
            initialData={editingCategorie}
            onClose={handleClosePopup}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog View catégorie */}
      <Dialog
        open={!!viewingCategorie}
        onClose={handleCloseView}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
            color: "white",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Détails de la catégorie
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewingCategorie && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                {viewingCategorie.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {viewingCategorie.description || "Aucune description"}
              </Typography>
              <Typography variant="body2">
                <strong>Slug :</strong> {viewingCategorie.slug || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Actif :</strong>{" "}
                {viewingCategorie.active ? "Oui" : "Non"}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default CategoriesCrud;