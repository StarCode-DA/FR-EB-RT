import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (token && rol) {
      authService.me()
        .then((data) => {
          setUser({ rol: data.rol, sede_id: data.sede_id, nombre: data.nombre });
          localStorage.setItem("usuario_id", data.id);
          localStorage.setItem("nombre_usuario", data.nombre); // ← agregar
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('rol');
          localStorage.removeItem('sede_id');
          localStorage.removeItem('usuario_id');
          localStorage.removeItem('nombre_usuario'); // ← agregar
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const me = await authService.me();
      setUser({ rol: data.rol, sede_id: data.sede_id, nombre: me.nombre });
      localStorage.setItem("usuario_id", me.id);
      localStorage.setItem("nombre_usuario", me.nombre); // ← agregar
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      const detail = error.response?.data?.detail;
      return { success: false, error: detail || 'The email or password is incorrect.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('sede_id');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('nombre_usuario'); // ← agregar
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasPermission = (permission) => {
    const permissions = {
      'home.view': ['administrador', 'mesero', 'cajero'],
      'usuarios.manage': ['administrador'],
      'productos.manage': ['administrador'],
      'inventarios.view': ['administrador', 'cajero'],
      'orders.create': ['administrador', 'mesero']
    };
    const allowedRoles = permissions[permission] || [];
    return allowedRoles.includes(user?.rol);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;