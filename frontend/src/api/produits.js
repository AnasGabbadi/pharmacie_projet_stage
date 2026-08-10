// src/api/produits.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ProduitsApi {
  // 📱 GET - Liste produits
  async getProduits(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/produits${query ? `?${query}` : ""}`);
    return response.json();
  }

  // 📄 GET - Liste produits + métadonnées de pagination (headers X-Total-Count
  // etc., exposés en CORS) — pour la recherche/filtres/pagination de la home.
  async getProduitsPage(params = {}) {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    const query = new URLSearchParams(cleaned).toString();
    const response = await fetch(`${API_BASE}/produits${query ? `?${query}` : ""}`);
    const produits = await response.json();

    return {
      produits,
      pagination: {
        total: Number(response.headers.get("X-Total-Count")) || 0,
        page: Number(response.headers.get("X-Page")) || Number(params.page) || 1,
        limite: Number(response.headers.get("X-Limite")) || Number(params.limite) || 20,
        pages: Number(response.headers.get("X-Total-Pages")) || 1,
      },
    };
  }

  // 👁️ GET - Produit par ID (expose ok/status pour distinguer 404 vs succès)
  async getProduitById(id) {
    const response = await fetch(`${API_BASE}/produits/${id}`);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
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
