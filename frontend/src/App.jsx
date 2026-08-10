import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./pages/private/AdminPanel";
import ClientPanel from "./pages/private/ClientPanel"; 
import LoginPage from "./pages/public/LoginPage";
import HomePage from "./pages/public/HomePage";
import "./resources/index.css";
import RegisterPage from "./pages/public/RegisterPage";
import CartPage from "./pages/public/CartPage";
import ProduitPage from "./pages/public/ProduitPage";

function PrivateAdminRoute({ children }) {
  const role = localStorage.getItem('role');
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function PrivateClientRoute({ children }) {
  const role = localStorage.getItem('role');
  if (role !== "client") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      {/* 📱 PUBLIQUES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/panier" element={<CartPage />} />
      <Route path="/produit/:id" element={<ProduitPage />} />

      {/* 👑 ADMIN PROTÉGÉ - CORRIGÉ ! */}
      <Route path="/admin/*" element={
        <PrivateAdminRoute>
          <AdminPanel />
        </PrivateAdminRoute>
      } />
      
      {/* 🛒 CLIENT PROTÉGÉ */}
      <Route path="/client/*" element={
        <PrivateClientRoute>
          <ClientPanel />
        </PrivateClientRoute>
      } />

      {/* 🔄 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;