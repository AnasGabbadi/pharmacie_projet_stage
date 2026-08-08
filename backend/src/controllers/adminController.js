import utilisateurService from "../services/utilisateurService.js";
import clientService from "../services/clientService.js";

const adminController = {
  getUsers: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin requis" });
    }

    const { page = 1, limit = 10, search } = req.query;

    const [usersResult, clientsResult] = await Promise.all([
      utilisateurService.getAll(parseInt(page), parseInt(limit), search),
      clientService.getAllClients(parseInt(page), parseInt(limit), search)
    ]);

    const allUsers = [
      ...usersResult.data.users.map(u => ({ ...u, type: 'utilisateur' })),
      ...clientsResult.data.clients.map(c => ({ ...c, type: 'client' }))
    ];

    const result = {
      success: true,
      data: {
        users: allUsers,
        total: usersResult.data.total + clientsResult.data.total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    };
    res.status(200).json(result);
  },

  // ✅ POST /api/admin/users - Créer manager (admin only)
  createManager: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin requis" });
    }

    const { nom, email, motDePasse } = req.body;
    const result = await utilisateurService.createManager({ nom, email, motDePasse });
    res.status(result.statusCode).json(result);
  },

  // ✅ DELETE /api/admin/users/:id - Supprimer user (admin only)
  deleteUser: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin requis" });
    }

    const result = await utilisateurService.delete(req.params.id);
    res.status(result.statusCode).json(result);
  },

  // ✅ GET /api/admin/clients - Liste clients (admin + manager)
  getClients: async (req, res) => {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const { page = 1, limit = 10, search } = req.query;
    const result = await clientService.getAllClients(parseInt(page), parseInt(limit), search);
    res.status(result.statusCode).json(result);
  },

  // ✅ PUT /api/admin/users/:id - Modifier user (admin only)
  updateUser: async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin requis" });
    }
    
    const result = await utilisateurService.update(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  },

  // ✅ DELETE /api/admin/clients/:id - Supprimer client (admin + manager)
  deleteClient: async (req, res) => {
    if (!["admin", "manager"].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Accès refusé" });
    }

    const result = await clientService.deleteClient(req.params.id);
    res.status(result.statusCode).json(result);
  }
};

export default adminController;