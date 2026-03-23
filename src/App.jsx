import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import MeseroPage from "./pages/MeseroPage";
import CajeroPage from "./pages/CajeroPage";
import ProtectedRoute from "./components/ProtectedRoute";

const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
  opacity: Math.random() * 0.9 + 0.05
}));

function App() {
  return (
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute rolesPermitidos={["administrador"]}>
              <AdminPage />
            </ProtectedRoute>
          } />

          <Route path="/mesero" element={
            <ProtectedRoute rolesPermitidos={["mesero"]}>
              <MeseroPage />
            </ProtectedRoute>
          } />

          <Route path="/cajero" element={
            <ProtectedRoute rolesPermitidos={["cajero"]}>
              <CajeroPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
