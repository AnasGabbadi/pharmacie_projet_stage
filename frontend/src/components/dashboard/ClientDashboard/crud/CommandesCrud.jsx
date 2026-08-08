// ══════════════════════════════════════════════════════════
// src/components/dashboard/ClientDashboard/CommandesCrud.jsx
// Version avec intégration Stripe
// ══════════════════════════════════════════════════════════
import { useEffect, useState } from "react";
import {
  Box, Stack, Typography, IconButton, Paper,
  CircularProgress, Alert, Button, Divider, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Visibility, ShoppingBag, Close,
  HourglassEmpty, CheckCircle, Inventory,
  LocalShipping, Cancel, CreditCard,
} from "@mui/icons-material";
import StripePaymentDialog from "../../../stripe/StripePaymentDialog";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const STATUT_CONFIG = {
  en_attente_paiement: { label: "⏳ Paiement en attente", color: "error",   icon: <CreditCard sx={{ fontSize: 14 }} /> },
  en_attente:          { label: "En attente",             color: "warning", icon: <HourglassEmpty sx={{ fontSize: 14 }} /> },
  validee:             { label: "Validée",                color: "info",    icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  preparee:            { label: "En prépa.",              color: "info",    icon: <Inventory sx={{ fontSize: 14 }} /> },
  livree:              { label: "Livrée",                 color: "success", icon: <LocalShipping sx={{ fontSize: 14 }} /> },
  annulee:             { label: "Annulée",                color: "error",   icon: <Cancel sx={{ fontSize: 14 }} /> },
};

function CommandesCrud() {
  const token = localStorage.getItem("token");

  const [commandes,       setCommandes]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [successMsg,      setSuccessMsg]      = useState("");
  const [viewingCommande, setViewingCommande] = useState(null);
  const [payingCommande,  setPayingCommande]  = useState(null); // commande à payer

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 4000); };

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API_BASE}/commandes/mes-commandes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCommandes(data.data || []);
      else setError(data.message || "Erreur chargement");
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommandes(); }, []);

  // ── Après paiement réussi → refresh + notif ───────────────
  const handlePaymentSuccess = async () => {
    setPayingCommande(null);
    showSuccess("🎉 Paiement réussi ! Votre commande est confirmée.");
    await fetchCommandes(); // Le webhook a déjà mis à jour le statut
  };

  const columns = [
    {
      field: "_id",
      headerName: "N° Commande",
      flex: 1, minWidth: 140,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Typography variant="body2" fontWeight={700} fontFamily="monospace">
          #{p.value?.slice(-8).toUpperCase()}
        </Typography>
      ),
    },
    {
      field: "dateCommande",
      headerName: "Date",
      flex: 1, minWidth: 120,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Typography variant="body2">
          {new Date(p.value).toLocaleDateString("fr-MA", { day: "numeric", month: "short", year: "numeric" })}
        </Typography>
      ),
    },
    {
      field: "lignes",
      headerName: "Articles",
      width: 90,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Chip label={`${p.value?.length || 0} art.`} size="small"
          sx={{ backgroundColor: "#e8f5e9", color: "#3E5F44", fontWeight: 600 }} />
      ),
    },
    {
      field: "montantTotal",
      headerName: "Total",
      width: 120,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Typography fontWeight={700} color="#3E5F44">
          {p.value?.toLocaleString()} DH
        </Typography>
      ),
    },
    {
      field: "statut",
      headerName: "Statut",
      width: 180,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => {
        const cfg = STATUT_CONFIG[p.value] || {};
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
      width: 160,
      sortable: false,
      headerClassName: "custom-header",
      headerAlign: "center", align: "center",
      renderCell: (p) => (
        <Stack direction="row" gap={0.5}>
          {/* Voir détail */}
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setViewingCommande(p.row); }}
            sx={{ color: "#3E5F44", backgroundColor: "rgba(62,95,68,0.1)", "&:hover": { backgroundColor: "rgba(62,95,68,0.2)" } }}>
            <Visibility fontSize="small" />
          </IconButton>

          {/* ✅ Bouton PAYER — visible uniquement pour commandes carte en attente paiement */}
          {p.row.statut === "en_attente_paiement" && p.row.modePaiement === "carte" && (
            <Button
              size="small"
              variant="contained"
              startIcon={<CreditCard sx={{ fontSize: 14 }} />}
              onClick={(e) => { e.stopPropagation(); setPayingCommande(p.row); }}
              sx={{
                backgroundColor: "#e74c3c",
                "&:hover": { backgroundColor: "#c0392b" },
                textTransform: "none", fontSize: "0.75rem",
                fontWeight: 700, borderRadius: 2, px: 1.5, py: 0.5,
              }}
            >
              Payer
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center"
        sx={{ padding: { xs: "12px 16px", sm: "16px 24px" } }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontSize: { xs: "1.2rem", sm: "1.8rem" } }}>
          <span style={{ color: "#3E5F44", fontWeight: 700 }}>Commandes / </span>
          Mes commandes
        </Typography>
        <Button variant="outlined" size="small" onClick={fetchCommandes}
          sx={{ textTransform: "none", borderColor: "#3E5F44", color: "#3E5F44", borderRadius: 2 }}>
          Actualiser
        </Button>
      </Stack>

      {/* Alertes */}
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

      {/* Bannière commandes en attente de paiement */}
      {commandes.some((c) => c.statut === "en_attente_paiement") && (
        <Box sx={{ px: 3, pb: 1 }}>
          <Alert severity="warning" icon={<CreditCard />} sx={{ borderRadius: 2 }}>
            <strong>Paiement requis</strong> — Vous avez {commandes.filter((c) => c.statut === "en_attente_paiement").length} commande(s) en attente de paiement.
          </Alert>
        </Box>
      )}

      {/* DataGrid */}
      <Box sx={{ flexGrow: 1, px: { xs: 1, sm: 2 }, pb: 3, minHeight: 0 }}>
        {!loading && commandes.length === 0 && !error ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 2 }}>
            <ShoppingBag sx={{ fontSize: 100, color: "#e0e0e0" }} />
            <Typography variant="h6" color="text.secondary">Aucune commande pour le moment</Typography>
          </Box>
        ) : (
          <DataGrid
            loading={loading}
            rows={commandes}
            getRowId={(row) => row._id}
            columns={columns}
            getRowClassName={(p) =>
              p.row.statut === "en_attente_paiement" ? "row-paiement-requis" : ""
            }
            sx={{
              height: "100%", border: "none", borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)", backgroundColor: "white",
              "& .custom-header": { backgroundColor: "#f5f5f5", fontWeight: 600, fontSize: "0.9rem", color: "#333" },
              "& .MuiDataGrid-columnHeaders": { borderRadius: "8px 8px 0 0", borderBottom: "2px solid #e0e0e0" },
              "& .MuiDataGrid-cell": { borderBottom: "1px solid #f0f0f0", padding: "8px 16px", display: "flex", alignItems: "center", justifyContent: "center" },
              "& .MuiDataGrid-row": {
                "&:hover": { backgroundColor: "#f8f9fa", cursor: "pointer" },
                "&:nth-of-type(even)": { backgroundColor: "#fafafa" },
              },
              // Surligner les commandes à payer
              "& .row-paiement-requis": {
                backgroundColor: "#fff5f5 !important",
                borderLeft: "3px solid #e74c3c",
              },
              "& .MuiDataGrid-footerContainer": { borderTop: "2px solid #e0e0e0", backgroundColor: "#f5f5f5" },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: "dateCommande", sort: "desc" }] },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            onRowClick={(p) => setViewingCommande(p.row)}
            autoHeight={false}
          />
        )}
      </Box>

      {/* ── Dialog Détail commande ── */}
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

              {/* Bannière paiement requis */}
              {viewingCommande.statut === "en_attente_paiement" && (
                <Alert severity="error" icon={<CreditCard />} sx={{ borderRadius: 2 }}>
                  <strong>Paiement requis</strong> — Cliquez sur "Payer maintenant" pour finaliser votre commande.
                </Alert>
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography fontWeight={600}>
                    {new Date(viewingCommande.dateCommande).toLocaleDateString("fr-MA", { day: "numeric", month: "long", year: "numeric" })}
                  </Typography>
                </Box>
                <Chip
                  label={STATUT_CONFIG[viewingCommande.statut]?.label || viewingCommande.statut}
                  color={STATUT_CONFIG[viewingCommande.statut]?.color || "default"}
                  icon={STATUT_CONFIG[viewingCommande.statut]?.icon}
                  sx={{ fontWeight: 600 }}
                />
              </Stack>

              <Divider />

              {/* Articles */}
              <Box>
                <Typography fontWeight={700} mb={1}>🛍️ Produits commandés</Typography>
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
                  <Typography variant="body2">{viewingCommande.adresseLivraison?.codePostal} {viewingCommande.adresseLivraison?.ville}</Typography>
                  <Typography variant="body2">{viewingCommande.adresseLivraison?.pays}</Typography>
                </Paper>
              </Box>

              {/* Total */}
              <Paper sx={{ p: 2, backgroundColor: "#f0f7f1", borderRadius: 2, border: "1px solid #c8e6c9" }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Mode de paiement</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {viewingCommande.modePaiement === "COD" ? "💵 Livraison" : "💳 Carte"}
                  </Typography>
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography fontWeight={700}>Total TTC</Typography>
                  <Typography fontWeight={800} color="#3E5F44" fontSize="1.1rem">
                    {viewingCommande.montantTotal?.toLocaleString()} DH
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setViewingCommande(null)} sx={{ textTransform: "none", color: "text.secondary" }}>
            Fermer
          </Button>
          {/* Bouton Payer si en attente paiement */}
          {viewingCommande?.statut === "en_attente_paiement" && (
            <Button
              variant="contained"
              startIcon={<CreditCard />}
              onClick={() => { setViewingCommande(null); setPayingCommande(viewingCommande); }}
              sx={{ backgroundColor: "#e74c3c", "&:hover": { backgroundColor: "#c0392b" }, textTransform: "none", fontWeight: 700, borderRadius: 2, px: 3 }}
            >
              Payer maintenant
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* ── Dialog Stripe Paiement ── */}
      <StripePaymentDialog
        open={!!payingCommande}
        commande={payingCommande}
        onClose={() => setPayingCommande(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Box>
  );
}

export default CommandesCrud;