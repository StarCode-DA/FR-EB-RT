import { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="col-md-4 mx-auto">
          <div className="d-flex justify-content-center align-items-center mb-4">
            <span className="text-warning fw-bold fs-2 ms-2">Eclipse Bar</span>
          </div>
          <div className="card p-4" style={{ backgroundColor: "#111", boxShadow: "0 0 10px 3px rgba(255, 193, 7, 0.4)", border: "1px solid #ffc107" }}>
            <h4 className="text-center mb-3 text-warning">Login</h4>
            <form>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="btn btn-warning w-100" onClick={handleLogin}>
                Sign In
              </button>
              <p className="text-center mt-3">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate("/forgot-password"); }} className="text-warning" style={{ fontSize: "0.85rem", textDecoration: "none" }}>
                  Forgot Password?
                </a>
                {" "}
                <span className="text-warning fw-bold" style={{ fontSize: "0.85rem" }}>Click here</span>
              </p>
              {error && <p className="text-danger text-center mt-2" style={{ fontSize: "0.85rem" }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;