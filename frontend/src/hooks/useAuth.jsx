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

  const login = async (email, motDePasse) => {
    try {
      console.log("🔗 API CALL:", email);
      const response = await authApi.login({ email, motDePasse });
      console.log("📥 RESPONSE:", response);

      if (response.success) {
        // SAUVE TOUT
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.role);
        localStorage.setItem("user", JSON.stringify(response.data.utilisateur));
        
        setUser(response.data.utilisateur);
        setRole(response.role);
        setIsAuthenticated(true);
        
        console.log("💾 SAVED:", { token: response.data.token?.slice(0,20), role: response.role });
        
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