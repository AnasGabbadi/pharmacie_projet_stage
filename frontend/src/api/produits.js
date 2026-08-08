// src/api/produits.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ProduitsApi {
  // 📱 GET - Liste produits
  async getProduits(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/produits${query ? `?${query}` : ""}`);
    return response.json();
  }

  // 👁️ GET - Produit par ID
  async getProduitById(id) {
    const response = await fetch(`${API_BASE}/produits/${id}`);
    return response.json();
  }

  // 👑 CREATE - Admin seulement
  async createProduit(data, token) {
    const response = await fetch(`${API_BASE}/produits`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",  // ✅ FIX : JSON pour objets
      },
      body: JSON.stringify(data),           // ✅ FIX : stringify
    });
    return response.json();
  }

  // ✏️ UPDATE - Admin seulement
  async updateProduit(id, data, token) {     // ✅ data au lieu de formData
    const response = await fetch(`${API_BASE}/produits/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // 🗑️ DELETE - Admin seulement
  async deleteProduit(id, token) {
    try {
      const response = await fetch(`${API_BASE}/produits/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // ✅ Guillemets corrects
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erreur HTTP ${response.status}`);
      }

      // ✅ 204 = SUCCÈS silencieux
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return { success: true, message: "Produit supprimé" };
      }

      return response.json();
    } catch (error) {
      console.error("Delete Produit Error:", error);
      throw error;
    }
  }
}

const produitsApi = new ProduitsApi();
export default produitsApi;
