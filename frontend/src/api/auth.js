const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class AuthService {
  async login(credentials) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  }

  async register(userData) {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  }

    async logout() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log("Logout API non disponible - localStorage nettoyé");
      }
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    
    return { success: true, message: "Déconnexion réussie" };
  }

  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Aucun token trouvé');
    
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      throw new Error(`Erreur ${response.status}`);
    }
    
    return response.json();
  }

  async updateProfile(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async updatePassword(passwords) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwords),
    });
    return response.json();
  }
}

export default new AuthService();