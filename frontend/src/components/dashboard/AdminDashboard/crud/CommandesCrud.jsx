import { useEffect, useState } from "react";
import {
  Box, Stack, Typography, IconButton, Paper,
  CircularProgress, Alert, Button, Divider, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  TextField, InputAdornment,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Visibility, Close, Search, Refresh,
  HourglassEmpty, CheckCircle, Inventory,
  LocalShipping, Cancel, Edit,
} from "@mui/icons-material";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ── Config statuts ────────────────────────────────────────
const STATUTS = [
  { value: "en_attente", label: "En attente",  color: "warning", icon: <HourglassEmpty sx={{ fontSize: 14 }} /> },
  { value: "validee",    label: "Validée",     color: "info",    icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  { value: "preparee",   label: "En prépa.",   color: "info",    icon: <Inventory sx={{ fontSize: 14 }} /> },
  { value: "livree",     label: "Livrée",      color: "success", icon: <LocalShipping sx={{ fontSize: 14 }} /> },
  { value: "annulee",    label: "Annulée",     color: "error",   icon: <Cancel sx={{ fontSize: 14 }} /> },
];
const statutMap = Object.fromEntries(STATUTS.map((s) => [s.value, s]));

// ── Couleur badge statut ──────────────────────────────────
const statutBgColor = {
  en_attente: "#fff8e1",
  validee:    "#e3f2fd",
  preparee:   "#e8eaf6",
  livree:     "#e8f5e9",
  annulee:    "#fdecea",
};

function CommandesCrud() {
  const token = localStorage.getItem("token");

  const [commandes,       setCommandes]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [searchQuery,     setSearchQuery]     = useState("");
  const [filterStatut,    setFilterStatut]    = useState("tous");
  const [viewingCommande, setViewingCommande] = useState(null);
  const [editingStatut,   setEditingStatut]   = useState(null); // { id, statut }
  const [savingStatut,    setSavingStatut]    = useState(false);
  const [successMsg,      setSuccessMsg]      = useState("");

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3500); };

  // ── Fetch toutes les commandes ────────────────────────────
  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/commandes/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCommandes(data.data || []);
      } else {
        setError(data.message || "Erreur chargement commandes");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommandes(); }, []);

  // ── Changer statut ────────────────────────────────────────
  const handleSaveStatut = async () => {
    if (!editingStatut) return;
    setSavingStatut(true);
    try {
      const res = await fetch(`${API_BASE}/commandes/admin/${editingStatut.id}/statut`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: editingStatut.statut }),
      });
      const data = await res.json();
      if (data.success) {
        // Mise à jour locale sans re-fetch
        setCommandes((prev) =>
          prev.map((c) => c._id === editingStatut.id ? { ...c, statut: editingStatut.statut } : c)
        );
        // Mettre à jour la commande en cours de visualisation si ouverte
        if (viewingCommande?._id === editingStatut.id) {
          setViewingCommande((p) => ({ ...p, statut: editingStatut.statut }));
        }
        setEditingStatut(null);
        showSuccess("✅ Statut mis à jour avec succès");
      } else {
        setError(data.message || "Erreur mise à jour statut");
      }
    } catch {
      setError("Erreur serveur");
    } finally {
      setSavingStatut(false);
    }
  };

  // ── Filtrage ──────────────────────────────────────────────
  const commandesFiltrees = commandes.filter((c) => {
    const matchSearch =
      !searchQuery ||
      c._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nomClient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.emailClient?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatut = filterStatut === "tous" || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  // ── Colonnes DataGrid ─────────────────────────────────────
  const columns = [
    {
      field: "_id",
      headerName: "N° Commande",
      maxWidth: 300,
      flex: 1, minWidth: 140,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Typography variant="body2" fontWeight={700} fontFamily="monospace" color="#3E5F44">
          #{p.value?.slice(-8).toUpperCase()}
        </Typography>
      ),
    },
    {
      field: "nomClient",
      headerName: "Client",
      maxWidth: 300,
      flex: 1.2, minWidth: 150,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Stack alignItems="center">
          <Typography variant="body2" fontWeight={600}>{p.value || "—"}</Typography>
          <Typography variant="caption" color="text.secondary">{p.row.emailClient}</Typography>
        </Stack>
      ),
    },
    {
      field: "dateCommande",
      headerName: "Date",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Typography variant="body2">
          {new Date(p.value).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" })}
        </Typography>
      ),
    },
    {
      field: "lignes",
      headerName: "Articles",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Chip label={`${p.value?.length || 0} art.`} size="small"
          sx={{ backgroundColor: "#e8f5e9", color: "#3E5F44", fontWeight: 600 }} />
      ),
    },
    {
      field: "montantTotal",
      headerName: "Montant",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Typography fontWeight={700} color="#3E5F44">
          {p.value?.toLocaleString()} DH
        </Typography>
      ),
    },
    {
      field: "modePaiement",
      headerName: "Paiement",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Chip
          label={p.value === "COD" ? "💵 Livraison" : "💳 Carte"}
          size="small" variant="outlined"
          sx={{ fontSize: "0.72rem" }}
        />
      ),
    },
    {
      field: "statut",
      headerName: "Statut",
      width: 200,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => {
        const cfg = statutMap[p.value] || {};
        return (
          <Chip
            label={cfg.label || p.value}
            color={cfg.color || "default"}
            size="small"
            icon={cfg.icon}
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Stack direction="row" gap={0.5}>
          <IconButton size="small" onClick={() => setViewingCommande(p.row)}
            sx={{ color: "#2196f3", backgroundColor: "rgba(33,150,243,0.1)", "&:hover": { backgroundColor: "rgba(33,150,243,0.2)", transform: "scale(1.1)" } }}>
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small"
            onClick={() => setEditingStatut({ id: p.row._id, statut: p.row.statut })}
            sx={{ color: "#3E5F44", backgroundColor: "rgba(62,95,68,0.1)", "&:hover": { backgroundColor: "rgba(62,95,68,0.2)", transform: "scale(1.1)" } }}>
            <Edit fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* ── Header ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center"
        sx={{ padding: { xs: "12px 16px", sm: "16px 24px" } }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontSize: { xs: "1.2rem", sm: "1.8rem" } }}>
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Commandes / </span>
          Gestion des commandes
        </Typography>
        <IconButton onClick={fetchCommandes}
          sx={{ color: "white", backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734", transform: "scale(1.05)" }, transition: "all 0.2s", borderRadius: "999px", px: 2, gap: 1 }}>
          <Refresh fontSize="small" />
          <Typography variant="button" sx={{ textTransform: "none" }}>Actualiser</Typography>
        </IconButton>
      </Stack>

      {/* ── Alertes ── */}
      {error && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>{error}</Alert>
        </Box>
      )}
      {successMsg && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Alert severity="success" onClose={() => setSuccessMsg("")} sx={{ borderRadius: 2 }}>{successMsg}</Alert>
        </Box>
      )}

      <Box sx={{ flexGrow: 1, px: { xs: 1, sm: 2 }, pb: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* ── Filtres ── */}
        <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            size="small"
            placeholder="Rechercher par N°, client, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: "#aaa" }} /></InputAdornment>,
            }}
            sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, backgroundColor: "white" } }}
          />
          <FormControl size="small" sx={{ minWidth: 170, mt: 1 }} >
            <InputLabel>Filtrer par statut</InputLabel>
            <Select value={filterStatut} label="Filtrer par statut"
              onChange={(e) => setFilterStatut(e.target.value)}
              sx={{ borderRadius: 2, backgroundColor: "white" }}>
              <MenuItem value="tous">Tous les statuts</MenuItem>
              {STATUTS.map((s) => (
                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* ── DataGrid ── */}
        <Box sx={{ flexGrow: 1, minHeight: 400 }}>
          <DataGrid
            loading={loading}
            rows={commandesFiltrees}
            getRowId={(row) => row._id}
            columns={columns}
            sx={{
              height: "100%",
              border: "none",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              backgroundColor: "white",
              "& .custom-header": { backgroundColor: "#f5f5f5", fontWeight: 600, fontSize: "0.9rem", color: "#333" },
              "& .MuiDataGrid-columnHeaders": { borderRadius: "8px 8px 0 0", borderBottom: "2px solid #e0e0e0" },
              "& .MuiDataGrid-cell": { borderBottom: "1px solid #f0f0f0", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center" },
              "& .MuiDataGrid-row": {
                "&:hover": { backgroundColor: "#f8f9fa", cursor: "pointer" },
                "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
              },
              "& .MuiDataGrid-footerContainer": { borderTop: "2px solid #e0e0e0", backgroundColor: "#f5f5f5" },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "dateCommande", sort: "desc" }] },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            onRowClick={(p) => setViewingCommande(p.row)}
            autoHeight={false}
          />
        </Box>
      </Box>

      {/* ══════════════════════════════════════════════════════
          Dialog — Détail commande (lecture)
      ══════════════════════════════════════════════════════ */}
      <Dialog open={!!viewingCommande} onClose={() => setViewingCommande(null)}
        maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" } }}>
        <DialogTitle sx={{
          background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
          color: "white", fontWeight: 600, textAlign: "center",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>Commande #{viewingCommande?._id?.slice(-8).toUpperCase()}</span>
          <IconButton size="small" onClick={() => setViewingCommande(null)} sx={{ color: "white" }}>
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {viewingCommande && (
            <Stack gap={2.5}>

              {/* Statut + date */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">Date de commande</Typography>
                  <Typography fontWeight={600}>
                    {new Date(viewingCommande.dateCommande).toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" })}
                  </Typography>
                </Box>
                <Stack direction="row" gap={1} alignItems="center">
                  <Chip
                    label={statutMap[viewingCommande.statut]?.label || viewingCommande.statut}
                    color={statutMap[viewingCommande.statut]?.color || "default"}
                    icon={statutMap[viewingCommande.statut]?.icon}
                    sx={{ fontWeight: 600 }}
                  />
                  <IconButton size="small"
                    onClick={() => { setViewingCommande(null); setEditingStatut({ id: viewingCommande._id, statut: viewingCommande.statut }); }}
                    sx={{ color: "#3E5F44", border: "1px solid #3E5F44" }}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider />

              {/* Infos client */}
              <Box>
                <Typography fontWeight={700} mb={1}>👤 Client</Typography>
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Stack gap={0.5}>
                    <Typography variant="body2" fontWeight={600}>{viewingCommande.nomClient}</Typography>
                    <Typography variant="body2" color="text.secondary">{viewingCommande.emailClient}</Typography>
                    <Typography variant="body2" color="text.secondary">📞 {viewingCommande.telephone}</Typography>
                  </Stack>
                </Paper>
              </Box>

              {/* Produits */}
              <Box>
                <Typography fontWeight={700} mb={1}>🛍️ Articles commandés</Typography>
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  {viewingCommande.lignes?.map((ligne, i) => (
                    <Box key={i}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{ligne.nomProduit}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {ligne.quantite} × {ligne.prixUnitaire?.toLocaleString()} DH
                          </Typography>
                        </Box>
                        <Typography fontWeight={700} color="#3E5F44">
                          {ligne.sousTotal?.toLocaleString()} DH
                        </Typography>
                      </Stack>
                      {i < viewingCommande.lignes.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Paper>
              </Box>

              {/* Adresse */}
              <Box>
                <Typography fontWeight={700} mb={1}>📍 Adresse de livraison</Typography>
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                  <Typography variant="body2">{viewingCommande.adresseLivraison?.rue}</Typography>
                  <Typography variant="body2">
                    {viewingCommande.adresseLivraison?.codePostal} {viewingCommande.adresseLivraison?.ville}
                  </Typography>
                  <Typography variant="body2">{viewingCommande.adresseLivraison?.pays}</Typography>
                </Paper>
              </Box>

              {/* Total + paiement */}
              <Paper sx={{ p: 2, backgroundColor: "#f0f7f1", borderRadius: 2, border: "1px solid #c8e6c9" }}>
                <Stack gap={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Mode de paiement</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {viewingCommande.modePaiement === "COD" ? "💵 Paiement à la livraison" : "💳 Carte bancaire"}
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={700}>Total TTC</Typography>
                    <Typography fontWeight={800} color="#3E5F44" fontSize="1.2rem">
                      {viewingCommande.montantTotal?.toLocaleString()} DH
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setViewingCommande(null)} sx={{ textTransform: "none", color: "text.secondary" }}>
            Fermer
          </Button>
          <Button variant="contained"
            onClick={() => { setViewingCommande(null); setEditingStatut({ id: viewingCommande._id, statut: viewingCommande.statut }); }}
            startIcon={<Edit />}
            sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, textTransform: "none", borderRadius: 2 }}>
            Modifier le statut
          </Button>
        </DialogActions>
      </Dialog>

      {/* ══════════════════════════════════════════════════════
          Dialog — Modifier statut
      ══════════════════════════════════════════════════════ */}
      <Dialog open={!!editingStatut} onClose={() => !savingStatut && setEditingStatut(null)}
        maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{
          background: "linear-gradient(135deg, #3E5F44 0%, #2f4734 100%)",
          color: "white", fontWeight: 600, textAlign: "center",
        }}>
          Modifier le statut
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 1 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Commande #{editingStatut?.id?.slice(-8).toUpperCase()}
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Nouveau statut</InputLabel>
            <Select
              value={editingStatut?.statut || ""}
              label="Nouveau statut"
              onChange={(e) => setEditingStatut((p) => ({ ...p, statut: e.target.value }))}
              sx={{ borderRadius: 2 }}
            >
              {STATUTS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  <Stack direction="row" alignItems="center" gap={1.5}>
                    <Chip
                      label={s.label}
                      color={s.color}
                      size="small"
                      icon={s.icon}
                      sx={{ fontWeight: 600, pointerEvents: "none" }}
                    />
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Aperçu visuel du statut sélectionné */}
          {editingStatut?.statut && (
            <Paper sx={{
              mt: 2, p: 2, borderRadius: 2, textAlign: "center",
              backgroundColor: statutBgColor[editingStatut.statut] || "#f5f5f5",
              border: "1px solid #e0e0e0",
            }}>
              <Typography variant="body2" color="text.secondary">Nouveau statut :</Typography>
              <Typography fontWeight={700} mt={0.5}>
                {statutMap[editingStatut.statut]?.label}
              </Typography>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1.5, gap: 1 }}>
          <Button onClick={() => setEditingStatut(null)} disabled={savingStatut}
            sx={{ textTransform: "none", color: "text.secondary" }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleSaveStatut} disabled={savingStatut}
            startIcon={savingStatut ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
            sx={{ backgroundColor: "#3E5F44", "&:hover": { backgroundColor: "#2f4734" }, textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}>
            {savingStatut ? "Sauvegarde..." : "Confirmer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CommandesCrud;