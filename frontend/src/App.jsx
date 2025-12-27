import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/Auth/AuthContext";
import "./resources/index.css";

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