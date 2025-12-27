import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./pages/private/AdminPanel";
import LoginPage from "./pages/public/LoginPage";
import { useAuth } from "./context/Auth/AuthContext";
import "./resources/index.css";
import HomePage from "./pages/public/HomePage";
import Navbar from "./components/layout/Navbar";

function PrivateAdminRoute({ children }) {
  const { state } = useAuth();

  if (!state.token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/" element={<HomePage />} />

      {/* Route de login admin (publique) */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Routes admin protégées */}
      <Route
        path="/admin/*"
        element={
          <PrivateAdminRoute>
            <AdminPanel />
          </PrivateAdminRoute>
        }
      />
    </Routes>
  );
}

export default App;