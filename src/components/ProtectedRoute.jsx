import { Navigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredPermission }) {
  const { user, loading, hasPermission } = useAuth();
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-warning" role="status" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Si no tiene permisos, redirigir a home en lugar de mostrar error
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default ProtectedRoute;