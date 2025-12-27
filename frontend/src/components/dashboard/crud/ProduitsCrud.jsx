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
import { Delete, Edit, Add } from "@mui/icons-material";
import ProduitForm from "./form/ProduitForm";
import {
  adminGetProduits,
  adminDeleteProduit,
} from "../../../services/produitsAdminApi";

function ProduitsCrud() {
  const [produits, setProduits] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);

  const fetchProduits = async () => {
    const res = await adminGetProduits();
    // suivant ton backend: soit {items:[...]} soit directement [...]
    setProduits(res.items || res || []);
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleAddClick = () => {
    setEditingProduit(null);
    setPopupOpen(true);
  };

  const handleEditClick = (produit) => {
    setEditingProduit(produit);
    setPopupOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      await adminDeleteProduit(id);
      fetchProduits();
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setEditingProduit(null);
    fetchProduits();
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
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Produits / </span>
          Liste des produits
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
          rows={produits}
          columns={[
            {
              field: "nom",
              headerName: "Nom",
              flex: 1,
              minWidth: 150,
              headerClassName: "custom-header",
            },
            {
              field: "imageUrl",
              headerName: "Image",
              flex: 0.5,
              minWidth: 90,
              headerClassName: "custom-header",
              renderCell: (params) =>
                params.value ? (
                  <Box
                    component="img"
                    src={params.value}
                    alt="img"
                    sx={{
                      height: 40,
                      width: 40,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: "2px solid #e0e0e0",
                    }}
                  />
                ) : (
                  <Typography
                    variant="caption"
                    sx={{ color: "#aaa", fontStyle: "italic" }}
                  >
                    Aucune
                  </Typography>
                ),
            },
            {
              field: "description",
              headerName: "Description",
              flex: 1.5,
              minWidth: 220,
              headerClassName: "custom-header",
            },
            {
              field: "prix",
              headerName: "Prix",
              width: 110,
              headerClassName: "custom-header",
              valueFormatter: (params) =>
                params.value != null ? `${params.value.toFixed(2)} DH` : "",
            },
            {
              field: "stock",
              headerName: "Stock",
              width: 100,
              headerClassName: "custom-header",
            },
            {
              field: "actif",
              headerName: "Actif",
              width: 90,
              headerClassName: "custom-header",
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
              width: 150,
              sortable: false,
              headerClassName: "custom-header",
              renderCell: (params) => (
                <Stack direction="row" spacing={0.5}>
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

      {/* Dialog form */}
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
          {editingProduit ? "Modifier le produit" : "Ajouter un produit"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ProduitForm initialData={editingProduit} onClose={handleClosePopup} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProduitsCrud;