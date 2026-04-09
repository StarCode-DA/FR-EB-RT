import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Products from './pages/Products';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarComponent from './components/Navbar';
import Users from './pages/Users'
import Inventory from './pages/Inventory'

// Generar estrellas aleatorias para el fondo
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
  opacity: Math.random() * 0.9 + 0.05
}));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ backgroundColor: "#111", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
          {stars.map(star => (
            <div key={star.id} style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 193, 7, 0.4)",
              opacity: star.opacity,
              pointerEvents: "none"
            }} />
          ))}
          <div style={{ position: "relative", zIndex: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/*" element={
                <PrivateRoute>
                  <>
                    <NavbarComponent />
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route
                        path='/inventory'
                        element={
                          <ProtectedRoute requiredPermission="inventarios.view">
                            <Inventory />
                          </ProtectedRoute>
                        }
                      />
                      <Route 
                        path='/products' 
                        element={
                            <ProtectedRoute requiredPermission="productos.manage">
                              <Products />
                            </ProtectedRoute>
                        } 
                      />  
                      <Route
                        path='/users'
                        element={
                          <ProtectedRoute requiredPermission="usuarios.manage">
                            <Users />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </>
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;