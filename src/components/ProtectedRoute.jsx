import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // 🔥 CORREGIDO

  if (!token) return <Navigate to="/login" />;

  if (rolesPermitidos && !rolesPermitidos.includes(role)) {
    return <Navigate to="/" />; // mejor que mandarlo a login
  }

  return children;
}