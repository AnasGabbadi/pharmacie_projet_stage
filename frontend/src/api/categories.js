// api/categories.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class CategoriesApi {
  // ✅ GET publique (comme produits)
  async getCategories(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/categories${query ? `?${query}` : ""}`);
    return response.json();
  }

  async getCategorieById(id) {
    const response = await fetch(`${API_BASE}/categories/${id}`);
    return response.json();
  }

  // ✅ CREATE admin (JSON simple)
  async createCategorie(data, token) {
    const response = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    console.log("📥 API STATUS:", response.status);
    
    if (!response.ok) { 
      const errorData = await response.json();
      console.error("❌ API ERROR:", errorData);
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    return response.json();
  }

  // ✅ UPDATE admin (JSON simple)
  async updateCategorie(id, data, token) {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // ✅ DELETE admin
  async deleteCategorie (id, token) {
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ FIX : Vérifie d'abord si réponse OK ET si body existe
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erreur HTTP ${response.status}`);
      }

      // ✅ FIX CRUCIAL : 204 No Content = SUCCÈS (pas de body)
      if (response.status === 204 || response.headers.get("content-length") === "0") {
        return { success: true, message: "Catégorie supprimée" };
      }

      // Autres status 2xx = parse JSON
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error("Delete API Error:", error);
      throw error;
    }
  }
}

const categoriesApi = new CategoriesApi();
export default categoriesApi;