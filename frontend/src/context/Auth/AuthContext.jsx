import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: localStorage.getItem("admin_token"),
    utilisateur: null,
  });

  const login = ({ token, utilisateur }) => {
    setState({ token, utilisateur });
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setState({ token: null, utilisateur: null });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);