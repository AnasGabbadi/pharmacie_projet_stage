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
import ProduitForm from "./form/ProduitForm";
import ProduitsApi from "../../../../api/produits";

function ProduitsCrud() {
  const [produits, setProduits] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingProduit, setEditingProduit] = useState(null);
  const [viewingProduit, setViewingProduit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduits = async () => {
    try {
      setLoading(true);
      const res = await ProduitsApi.getProduits({ actif: true }); // ✅ Params
      setProduits(res.items || res.data || res || []);
    } catch (error) {
      console.error("Erreur fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleAddClick = () => {
    setEditingProduit(null);
    setPopupOpen(true);
  };

  // ✅ FIX : id + appel API correct
  const handleEditClick = (produit) => {
    setEditingProduit(produit);
    setPopupOpen(true);
  };

  const handleViewClick = (produit) => {
    setViewingProduit(produit);
  };

  // ✅ FIX : await + refresh
  const handleDeleteClick = async (id) => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await ProduitsApi.deleteProduit(id, localStorage.getItem("token"));
        fetchProduits(); // ✅ Refresh après delete
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setEditingProduit(null);
    fetchProduits(); // ✅ Refresh après create/update
  };

  const handleCloseView = () => {
    setViewingProduit(null);
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
          loading={loading} 
          rows={produits}
          getRowId={(row) => row._id}
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
              field: "imageUrl",
              headerName: "Image",
              flex: 0.5,
              minWidth: 90,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
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
              headerAlign: "center",
              align: "center",
            },
            {
              field: "prix",
              headerName: "Prix",
              width: 110,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
              valueFormatter: (value) => (value != null ? `${value} DH` : ""),
            },
            {
              field: "stock",
              headerName: "Stock",
              width: 100,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "actif",
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
              renderCell: (params) => (
                <Stack direction="row" spacing={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => handleViewClick(params.row)}
                    sx={{
                      color: "#2196f3",
                      backgroundColor: "rgba(33, 150, 243, 0.1)",
                      "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.2)", transform: "scale(1.1)" },
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(params.row)} // ✅ Correct
                    sx={{
                      color: "#3E5F44",
                      backgroundColor: "rgba(62, 95, 68, 0.1)",
                      "&:hover": { backgroundColor: "rgba(62, 95, 68, 0.2)", transform: "scale(1.1)" },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(params.row._id)} // ✅ _id seulement
                    sx={{
                      color: "#f44336",
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.2)", transform: "scale(1.1)" },
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Stack>
              ),
            },
          ]}

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
          {editingProduit ? "Modifier le produit" : "Ajouter un produit"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <ProduitForm initialData={editingProduit} onClose={handleClosePopup} />
        </DialogContent>
      </Dialog>

      {/* Dialog View produit (détails en lecture seule) */}
      <Dialog
        open={!!viewingProduit}
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
            background: "linear-gradient(135deg, #3E5F44 0%, #3E5F44 100%)",
            color: "white",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Détails du produit
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewingProduit && (
            <Stack spacing={2}>
              {viewingProduit.imageUrl && (
                <Box
                  component="img"
                  src={viewingProduit.imageUrl}
                  alt={viewingProduit.nom}
                  sx={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "contain",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                  }}
                />
              )}
              <Typography variant="h6" fontWeight={600}>
                {viewingProduit.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {viewingProduit.description || "Aucune description"}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Typography variant="body2">
                  <strong>Prix :</strong> {viewingProduit.prix} DH
                </Typography>
                <Typography variant="body2">
                  <strong>Stock :</strong> {viewingProduit.stock}
                </Typography>
              </Stack>
              <Typography variant="body2">
                <strong>Actif :</strong>{" "}
                {viewingProduit.actif ? "Oui" : "Non"}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default ProduitsCrud;