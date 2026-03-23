import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolesPermitidos }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  if (!token) return <Navigate to="/login" />;
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) return <Navigate to="/login" />;

  return children;
}