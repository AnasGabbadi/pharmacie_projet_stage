const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class CartApi {
  // ✅ Méthode unique getCart avec token + guestId
  async getCart(token, guestId) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (guestId && !token) headers['X-Guest-Id'] = guestId;

    const response = await fetch(`${API_BASE}/cart`, { headers });
    return response.json();
  }

  async addItem(productId, quantity, token, guestId) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (guestId && !token) headers['X-Guest-Id'] = guestId;

    const response = await fetch(`${API_BASE}/cart/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, quantity }),
    });
    return response.json();
  }

  async updateItem(productId, quantity, token, guestId) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (guestId && !token) headers['X-Guest-Id'] = guestId;

    const response = await fetch(`${API_BASE}/cart/items/${productId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    return response.json();
  }

  async deleteItem(productId, token, guestId) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (guestId && !token) headers['X-Guest-Id'] = guestId;

    const response = await fetch(`${API_BASE}/cart/items/${productId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    if (response.status === 204) return { success: true };
    return response.json();
  }

  async clearCart(token, guestId) {
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (guestId && !token) headers['X-Guest-Id'] = guestId;

    const response = await fetch(`${API_BASE}/cart`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    if (response.status === 204) return { success: true };
    return response.json();
  }

  async checkout(payload, token) {
    const response = await fetch(`${API_BASE}/commandes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    return response.json();
  }
}

export default new CartApi();