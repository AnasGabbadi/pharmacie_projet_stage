const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class UsersApi {
  // 📱 GET - Liste utilisateurs (admin only)
  async getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/admin/users${query ? `?${query}` : ""}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  }

  // 👑 CREATE - Créer manager (admin only)
  async createManager(data, token) {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // ✏️ UPDATE - Modifier utilisateur (admin only)
  async updateUser(id, data, token) {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // 🗑️ DELETE - Supprimer utilisateur (admin only)
  async deleteUser(id, token) {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erreur HTTP ${response.status}`);
      }

      // ✅ 204 = SUCCÈS
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return { success: true, message: "Utilisateur supprimé" };
      }

      return await response.json();
    } catch (error) {
      console.error("Delete User Error:", error);
      throw error;
    }
  }

  // 📱 GET - Liste clients (admin + manager)
  async getClients(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/admin/clients${query ? `?${query}` : ""}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
  }

  // 🗑️ DELETE - Supprimer client (admin + manager)
  async deleteClient(id, token) {
    try {
      const response = await fetch(`${API_BASE}/admin/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erreur HTTP ${response.status}`);
      }

      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return { success: true, message: "Client supprimé" };
      }

      return await response.json();
    } catch (error) {
      console.error("Delete Client Error:", error);
      throw error;
    }
  }
}

export default new UsersApi();
