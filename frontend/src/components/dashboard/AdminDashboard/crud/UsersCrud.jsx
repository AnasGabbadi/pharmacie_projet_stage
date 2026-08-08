import { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent,
  IconButton, Stack, Typography, Box,
  Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Add, Visibility } from "@mui/icons-material";
import UsersForm from "./form/UsersForm";
import usersApi from "../../../../api/users"

function UsersCrud() {
  const [users, setUsers] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: 1,
        limit: 50,
        search
      });
      const res = await usersApi.getUsers(params.toString());
      setUsers(res.data?.users || res.items || res || []);
    } catch (error) {
      console.error("Erreur fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleAddClick = () => {
    setEditingUser(null);
    setPopupOpen(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setPopupOpen(true);
  };

  const handleViewClick = (user) => {
    setViewingUser(user);
  };

  const handleDeleteClick = async (id, userType) => {
    const user = users.find(u => u._id === id);
    if (!user) {
      alert("❌ Utilisateur introuvable");
      return;
    }

    const typeLabel = userType === 'client' ? 'client' : 'utilisateur';
    if (window.confirm(`Supprimer "${user.nom}" (${typeLabel}) ?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("🔐 Session expirée - Reconnexion");
          window.location.href = "/login";
          return;
        }

        // ✅ CHOIX API selon TYPE
        if (userType === 'client') {
          await usersApi.deleteClient(id, token); 
        } else {
          await usersApi.deleteUser(id, token); 
        }

        fetchUsers();
        alert("✅ Supprimé avec succès !");
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("❌ Erreur: " + (error.message || "Serveur indisponible"));
      }
    }
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleCloseView = () => {
    setViewingUser(null);
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ padding: { xs: "12px 16px", sm: "16px 24px" } }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ fontSize: { xs: "1.2rem", sm: "1.8rem" } }}
        >
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Utilisateurs / </span>
          Gestion des comptes
        </Typography>

        <IconButton
          onClick={handleAddClick}
          sx={{
            color: "white",
            backgroundColor: "#3E5F44",
            "&:hover": { backgroundColor: "#2f4734", transform: "scale(1.05)" },
            transition: "all 0.2s ease",
            borderRadius: "999px",
            px: 2,
            gap: 1,
          }}
        >
          <Add fontSize="small" />
          <Typography variant="button" sx={{ textTransform: "none" }}>
            Nouveau Manager
          </Typography>
        </IconButton>
      </Stack>

      {/* DataGrid */}
      <Box sx={{ flexGrow: 1, padding: { xs: "8px", sm: "16px" }, minHeight: 0 }}>
        <DataGrid
          loading={loading}
          rows={users}
          getRowId={(row) => row._id}
          columns={[
            {
              field: "nom",
              headerName: "Nom",
              flex: 1,
              maxWidth: 400,
              minWidth: 180,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "email",
              headerName: "Email",
              flex: 1.5,
              maxWidth: 500,
              minWidth: 220,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
            },
            {
              field: "role",
              headerName: "Rôle",
              width: 400,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
              renderCell: (params) => (
                <Chip
                  label={params.value}
                  color={params.value === 'admin' ? 'error' : 'primary'}
                  size="small"
                />
              ),
            },
            {
              field: "createdAt",
              headerName: "Créé le",
              width: 300,
              headerClassName: "custom-header",
              headerAlign: "center",
              align: "center",
              valueFormatter: (value) =>
                new Date(value).toLocaleDateString('fr-FR'),
            },
            {
              field: "actions",
              headerName: "Actions",
              width: 180,
              sortable: false,
              renderCell: (params) => {
                const isClient = params.row.type === 'client';

                return (
                  <Stack direction="row" spacing={0.5}>
                    {/* 👁️ VIEW → TOUS */}
                    <IconButton
                      size="small"
                      onClick={() => handleViewClick(params.row)}
                      sx={{
                        color: "#2196f3",
                        backgroundColor: "rgba(33, 150, 243, 0.1)",
                        "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.2)" },
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>

                    {/* ✏️ EDIT → UTILISATEURS UNIQUEMENT */}
                    {!isClient && (
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(params.row)}
                        sx={{
                          color: "#3E5F44",
                          backgroundColor: "rgba(62, 95, 68, 0.1)",
                          "&:hover": { backgroundColor: "rgba(62, 95, 68, 0.2)" },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}

                    {/* 🗑️ DELETE → TOUS */}
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(params.row._id, params.row.type)}
                      sx={{
                        color: "#f44336",
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                        "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.2)" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                );
              },
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
              "&:hover": { backgroundColor: "#f8f9fa", cursor: "pointer" },
              "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
            },
          }}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          autoHeight={false}
        />
      </Box>

      {/* Dialog Formulaire (Create/Edit) */}
      <Dialog
        open={popupOpen}
        onClose={handleClosePopup}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" },
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
          {editingUser ? "Modifier l'utilisateur" : "Créer un Manager"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <UsersForm
            initialData={editingUser}
            onClose={handleClosePopup}
            onSuccess={fetchUsers}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Vue détails */}
      <Dialog
        open={!!viewingUser}
        onClose={handleCloseView}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" },
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
          Détails utilisateur
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewingUser && (
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                {viewingUser.nom}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {viewingUser.email}
              </Typography>
              <Typography variant="body2">
                <strong>Rôle:</strong>
                <Chip
                  label={viewingUser.role}
                  color={viewingUser.role === 'admin' ? 'error' : 'primary'}
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2">
                <strong>Créé le:</strong> {new Date(viewingUser.createdAt).toLocaleDateString('fr-FR')}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default UsersCrud;