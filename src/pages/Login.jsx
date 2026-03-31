import { useState } from "react";
import NavbarComponent from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await authService.login(email, password);

      // Save token
      localStorage.setItem("token", data.token);

      //  Convert role to English
      let role = "";

      if (data.rol === "administrador") role = "ADMIN";
      else if (data.rol === "mesero") role = "WAITER";
      else if (data.rol === "cajero") role = "CASHIER";

      localStorage.setItem("role", role);

      //  Redirect to dashboard based on role
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "WAITER") {
        navigate("/mesero");
      } else if (role === "CASHIER") {
        navigate("/cajero");
      }

    } catch (err) {
      setError("The email or password is incorrect");
    }
  };

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-5">
        <div className="col-md-4 mx-auto">
          <div
            className="card p-4"
            style={{
              backgroundColor: "#111",
              boxShadow: "0 0 10px 3px rgba(255, 193, 7, 0.4)",
              border: "1px solid #ffc107"
            }}
          >
            <h4 className="text-center mb-3 text-warning">Login</h4>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-warning w-100">
                Sign In
              </button>

              <p className="text-center mt-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-warning"
                  style={{ fontSize: "0.85rem", textDecoration: "none" }}
                >
                  Forgot Password?
                </a>{" "}
                <span
                  className="text-warning fw-bold"
                  style={{ fontSize: "0.85rem" }}
                >
                  Click here
                </span>
              </p>

              {error && (
                <p
                  className="text-danger text-center mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}