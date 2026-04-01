import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../services/api";
import { MS_AUTH_URL } from "../config";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [step, setStep] = useState(1); // 1: buscar email, 2: responder pregunta
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleFindUser = async () => {
    try {
      const res = await api.get(`${MS_AUTH_URL}/security-question?email=${email}`);
      setSecurityQuestion(res.data.security_question);
      setStep(2);
      setError("");
    } catch (err) {
      setError("Email not found");
    }
  };
  const handleResetPassword = async () => {
    try {
      await api.post(`${MS_AUTH_URL}/forgot-password`, {
        email,
        security_answer: securityAnswer,
        new_password: newPassword
      });
      setSuccess("Password updated successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error updating password");
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
            <h4 className="text-center mb-3 text-warning">Forgot Password</h4>
            {/*Paso 1: Buscar email*/}
            {step === 1 && (
              <>
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="button" className="btn btn-warning w-100" onClick={handleFindUser}>
                  Continue
                </button>
              </>
            )}
            {/*Paso 2: Responder pregunta de seguridad y cambiar contraseña*/}
            {step === 2 && (
              <>
                <p className="text-white mb-2">{securityQuestion}</p>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Your answer"
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                />
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="button" className="btn btn-warning w-100" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </>
            )}
            {/* Mostrar mensajes de error o éxito */}
            {error && <p className="text-danger text-center mt-2" style={{ fontSize: "0.85rem" }}>{error}</p>}
            {success && <p className="text-success text-center mt-2" style={{ fontSize: "0.85rem" }}>{success}</p>}
            <p className="text-center mt-3">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}
                className="text-warning" style={{ fontSize: "0.85rem", textDecoration: "none" }}>
                Back to Login
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ForgotPassword;