import { useState, useEffect, createContext, useContext } from "react";
import authApi from "../api/auth.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Stocke la session (token/role/user) et met à jour le contexte — utilisé
  // aussi bien après un login que juste après une inscription réussie.
  const persistSession = (token, role, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    setRole(role);
    setIsAuthenticated(true);
  };

  const login = async (email, motDePasse) => {
    try {
      const response = await authApi.login({ email, motDePasse });

      if (response.success) {
        // Le backend renvoie l'objet utilisateur sous une clé différente selon
        // le rôle : "client" (clientService.login) ou "utilisateur" (admin/manager,
        // via utilisateurService.login) — on lit celle qui est réellement présente.
        const user = response.data.client || response.data.utilisateur;
        persistSession(response.data.token, response.role, user);

        return {
          success: true,
          role: response.role,
          redirect: response.redirect || "/admin" // BACKEND PRIORITÉ
        };
      }

      return { success: false, message: response.message || "Erreur login" };
    } catch (error) {
      console.error("💥 CATCH ERROR:", error);
      return { success: false, message: error.message || "Erreur réseau" };
    }
  };

  // Inscription (clients uniquement) — même mécanisme de session que login,
  // pour connecter automatiquement l'utilisateur après un register réussi.
  const register = async (formData) => {
    try {
      const response = await authApi.register(formData);

      if (response.success) {
        const role = response.data?.client?.role || "client";
        persistSession(response.data.token, role, response.data.client);

        return {
          success: true,
          role,
          redirect: response.redirect || "/client/dashboard"
        };
      }

      return { success: false, message: response.message || "Erreur lors de l'inscription" };
    } catch (error) {
      console.error("💥 REGISTER CATCH ERROR:", error);
      return { success: false, message: error.message || "Erreur réseau" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile.data);
      return profile;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const value = {
    user,
    role,
    loading,
    isAuthenticated,
    token,
    login,
    register,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
};