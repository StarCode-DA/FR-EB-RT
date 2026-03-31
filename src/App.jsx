import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import MeseroPage from "./pages/MeseroPage";
import CajeroPage from "./pages/CajeroPage";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";

//  Fondo de estrellas (lo mantenemos igual)
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${Math.random() * 2 + 1}px`,
  opacity: Math.random() * 0.9 + 0.05
}));

function App() {
  return (
    <div
      style={{
        backgroundColor: "#111",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/*  Estrellas */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 193, 7, 0.4)",
            opacity: star.opacity,
            pointerEvents: "none"
          }}
        />
      ))}

      <BrowserRouter>
        <Routes>
          {/*  Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/*  ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolesPermitidos={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/*  WAITER */}
          <Route
            path="/mesero"
            element={
              <ProtectedRoute rolesPermitidos={["WAITER"]}>
                <MeseroPage />
              </ProtectedRoute>
            }
          />

          {/*  CASHIER */}
          <Route
            path="/cajero"
            element={
              <ProtectedRoute rolesPermitidos={["CASHIER"]}>
                <CajeroPage />
              </ProtectedRoute>
            }
          />

          {/*  PRODUCTS */}
          <Route
            path="/products"
            element={
              <ProtectedRoute rolesPermitidos={["ADMIN"]}>
                <Products />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;