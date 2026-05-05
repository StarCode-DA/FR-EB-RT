import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { userService } from "../services/api";

const SEDES = [
  { value: "1", label: "Galerías" },
  { value: "2", label: "Restrepo" },
  { value: "3", label: "Zona T" },
];

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your first school?",
  "What is your oldest sibling's middle name?",
];

// Reglas de validación por campo
const rules = {
  nombre: (v) => {
    if (!v?.trim()) return "Full name is required";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)) return "Only letters are allowed";
    return null;
  },
  email: (v) => {
    if (!v?.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
      return "Email must follow the format example@eclipsebar.com";
    return null;
  },
  password: (v) => {
    if (!v?.trim()) return "Password is required";
    if (v.length < 8) return "Minimum 8 characters";
    if (!/[A-Z]/.test(v)) return "Must include at least one uppercase letter";
    if (!/[a-z]/.test(v)) return "Must include at least one lowercase letter";
    if (!/\d/.test(v)) return "Must include at least one number";
    return null;
  },
  passwordOpcional: (v) => {
    if (!v) return null; // opcional en edición
    if (v.length < 8) return "Minimum 8 characters";
    if (!/[A-Z]/.test(v)) return "Must include at least one uppercase letter";
    if (!/[a-z]/.test(v)) return "Must include at least one lowercase letter";
    if (!/\d/.test(v)) return "Must include at least one number";
    return null;
  },
  telefono: (v) => {
    if (!v?.trim()) return "Phone number is required";
    if (!/^\d+$/.test(v)) return "Only numbers are allowed";
    return null;
  },
  rol: (v) => (!v ? "Role is required" : null),
  sede_id: (v, rol) =>
    rol && rol !== "administrador" && !v ? "Location is required" : null,
  security_question: (v) =>
    !v?.trim() ? "Security question is required" : null,
  security_answer: (v) =>
    !v?.trim() ? "Security answer is required" : null,
};

const emptyTouched = {
  nombre: false, email: false, password: false,
  telefono: false, rol: false, sede_id: false,
  security_question: false, security_answer: false,
};

// Componente de campo con error inline
function Field({ label, type = "text", value, onChange, onBlur, error, touched, as: Tag = "input", children, disabled }) {
  const invalid = touched && !!error;
  return (
    <div className="mb-3">
      {Tag === "input" || Tag === "textarea" ? (
        <Tag
          className={`form-control${invalid ? " is-invalid" : touched && !error ? " is-valid" : ""}`}
          type={type}
          placeholder={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        />
      ) : (
        <select
          className={`form-control${invalid ? " is-invalid" : touched && !error ? " is-valid" : ""}`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
        >
          {children}
        </select>
      )}
      {invalid && (
        <div className="invalid-feedback d-block" style={{ fontSize: "0.8rem" }}>
          {error}
        </div>
      )}
    </div>
  );
}

// Helpers
function computeErrors(form, isEdit = false) {
  return {
    nombre: rules.nombre(form.nombre),
    email: rules.email(form.email),
    password: isEdit
      ? rules.passwordOpcional(form.password)
      : rules.password(form.password),
    telefono: rules.telefono(form.telefono),
    rol: isEdit ? null : rules.rol(form.rol),
    sede_id: rules.sede_id(form.sede_id, form.rol),
    security_question: rules.security_question(form.security_question),
    security_answer: isEdit ? null : rules.security_answer(form.security_answer),
  };
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [showCrear, setShowCrear] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtreSede, setFiltreSede] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 6;

  const emptyCrear = {
    email: "", password: "", nombre: "", telefono: "",
    rol: "", sede_id: "", security_question: "", security_answer: "",
  };
  const emptyEditar = {
    email: "", password: "", nombre: "", telefono: "",
    rol: "mesero", sede_id: "", security_question: "", security_answer: "",
  };

  const [formCrear, setFormCrear] = useState(emptyCrear);
  const [formEditar, setFormEditar] = useState(emptyEditar);
  const [touchedCrear, setTouchedCrear] = useState(emptyTouched);
  const [touchedEditar, setTouchedEditar] = useState(emptyTouched);
  const [apiError, setApiError] = useState("");

  const errorsCrear = computeErrors(formCrear, false);
  const errorsEditar = computeErrors(formEditar, true);

  const cargarUsuarios = async () => {
    try {
      const data = await userService.listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);
  useEffect(() => { setPaginaActual(1); }, [busqueda, filtreSede]);

  const touchCrear = (field) =>
    setTouchedCrear((p) => ({ ...p, [field]: true }));
  const touchEditar = (field) =>
    setTouchedEditar((p) => ({ ...p, [field]: true }));

  const changeCrear = (field) => (e) => {
    let value = e.target.value;
    if (field === "nombre") value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    if (field === "telefono") value = value.replace(/\D/g, "");
    setFormCrear((p) => ({ ...p, [field]: value }));
  };

  const changeEditar = (field) => (e) => {
    let value = e.target.value;
    if (field === "nombre") value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    if (field === "telefono") value = value.replace(/\D/g, "");
    setFormEditar((p) => ({ ...p, [field]: value }));
  };

  const handleCrear = async () => {
    // Marcar todos los campos como tocados para mostrar todos los errores
    setTouchedCrear(Object.fromEntries(Object.keys(emptyTouched).map((k) => [k, true])));
    if (hasErrors(errorsCrear)) return;
    setApiError("");
    try {
      await userService.crearUsuario({
        ...formCrear,
        sede_id: formCrear.sede_id ? parseInt(formCrear.sede_id) : null,
      });
      setShowCrear(false);
      await cargarUsuarios();
    } catch (err) {
      setApiError(
        typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response?.data?.detail)
      );
    }
  };

  const handleAbrirEditar = (usuario) => {
    setUsuarioEditandoId(usuario.id);
    setFormEditar({
      email: usuario.email,
      password: "",
      nombre: usuario.nombre,
      telefono: usuario.telefono || "",
      rol: usuario.rol,
      sede_id: usuario.sede_id ? String(usuario.sede_id) : "",
      security_question: usuario.security_question || "",
      security_answer: "",
    });
    setTouchedEditar(emptyTouched);
    setApiError("");
    setShowEditar(true);
  };

  const handleEditar = async () => {
    setTouchedEditar(Object.fromEntries(Object.keys(emptyTouched).map((k) => [k, true])));
    if (hasErrors(errorsEditar)) return;
    setApiError("");
    try {
      const payload = {};
      if (formEditar.email) payload.email = formEditar.email;
      if (formEditar.nombre) payload.nombre = formEditar.nombre;
      if (formEditar.telefono) payload.telefono = formEditar.telefono;
      if (formEditar.rol) payload.rol = formEditar.rol;
      if (formEditar.sede_id) payload.sede_id = parseInt(formEditar.sede_id);
      if (formEditar.security_question) payload.security_question = formEditar.security_question;
      if (formEditar.security_answer) payload.security_answer = formEditar.security_answer;
      if (formEditar.password) payload.password = formEditar.password;
      await userService.actualizarUsuario(usuarioEditandoId, payload);
      setShowEditar(false);
      await cargarUsuarios();
    } catch (err) {
      setApiError(
        typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response?.data?.detail)
      );
    }
  };

  const handleToggleActivo = async (usuario) => {
    try {
      await userService.toggleActivo(usuario.id);
      await cargarUsuarios();
    } catch (err) {
      console.error("Error cambiando estado del usuario", err);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideNombre = u.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideSede =
      filtreSede === "" ||
      u.sede_id === parseInt(filtreSede) ||
      (filtreSede === "todas" && u.rol === "administrador");
    return coincideNombre && coincideSede;
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * usuariosPorPagina,
    paginaActual * usuariosPorPagina
  );

  const modalStyle = { backgroundColor: "#111" };
  const headerStyle = { ...modalStyle, color: "#ffc107", borderBottom: "1px solid #ffc107" };

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-warning">Users</h4>
          <Button
            variant="warning"
            onClick={() => {
              setFormCrear(emptyCrear);
              setTouchedCrear(emptyTouched);
              setApiError("");
              setShowCrear(true);
            }}
          >
            + Create user
          </Button>
        </div>

        <div className="d-flex gap-3 mb-3">
          <input
            className="form-control"
            placeholder="Search by name..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select
            className="form-control"
            value={filtreSede}
            onChange={(e) => setFiltreSede(e.target.value)}
          >
            <option value="">All locations</option>
            {SEDES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            <option value="todas">Administrators</option>
          </select>
        </div>

        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th>
              <th>Role</th><th>Location</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPaginados.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-warning py-4">No users found</td>
              </tr>
            ) : (
              usuariosPaginados.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.telefono ?? "-"}</td>
                  <td>{{ administrador: "Administrator", cajero: "Cashier", mesero: "Waiter" }[u.rol]}</td>
                  <td>{u.sede}</td>
                  <td className="text-center">{u.activo ? "✅" : "❌"}</td>
                  <td>
                    <Button variant="outline-warning" size="sm" onClick={() => handleAbrirEditar(u)}>Edit</Button>
                    <Button
                      variant={u.activo ? "outline-danger" : "outline-success"}
                      size="sm"
                      style={{ marginLeft: "8px" }}
                      onClick={() => handleToggleActivo(u)}
                    >
                      {u.activo ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <Button variant="outline-warning" size="sm" disabled={paginaActual === 1}
            onClick={() => setPaginaActual((p) => p - 1)}>← Prev</Button>
          <span className="text-warning">{paginaActual} / {totalPaginas || 1}</span>
          <Button variant="outline-warning" size="sm"
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            onClick={() => setPaginaActual((p) => p + 1)}>Next →</Button>
        </div>
      </div>

      {/* MODAL CREAR */}
      <Modal show={showCrear} onHide={() => setShowCrear(false)} centered>
        <Modal.Header closeButton style={headerStyle}>
          <Modal.Title>Create user</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyle}>
          <Field label="Full name" value={formCrear.nombre}
            onChange={changeCrear("nombre")} onBlur={() => touchCrear("nombre")}
            error={errorsCrear.nombre} touched={touchedCrear.nombre} />

          <Field label="Email" type="email" value={formCrear.email}
            onChange={changeCrear("email")} onBlur={() => touchCrear("email")}
            error={errorsCrear.email} touched={touchedCrear.email} />

          <Field label="Password" type="password" value={formCrear.password}
            onChange={changeCrear("password")} onBlur={() => touchCrear("password")}
            error={errorsCrear.password} touched={touchedCrear.password} />

          <Field label="Phone" value={formCrear.telefono}
            onChange={changeCrear("telefono")} onBlur={() => touchCrear("telefono")}
            error={errorsCrear.telefono} touched={touchedCrear.telefono} />

          <Field as="select" label="Role" value={formCrear.rol}
            onChange={changeCrear("rol")} onBlur={() => touchCrear("rol")}
            error={errorsCrear.rol} touched={touchedCrear.rol}>
            <option value="">Select role</option>
            <option value="mesero">Waiter</option>
            <option value="cajero">Cashier</option>
            <option value="administrador">Administrator</option>
          </Field>

          {formCrear.rol && formCrear.rol !== "administrador" && (
            <Field as="select" label="Location" value={formCrear.sede_id}
              onChange={changeCrear("sede_id")} onBlur={() => touchCrear("sede_id")}
              error={errorsCrear.sede_id} touched={touchedCrear.sede_id}>
              <option value="">Select location</option>
              {SEDES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Field>
          )}

          <Field as="select" label="Security question" value={formCrear.security_question}
            onChange={changeCrear("security_question")} onBlur={() => touchCrear("security_question")}
            error={errorsCrear.security_question} touched={touchedCrear.security_question}>
            <option value="">Select a security question</option>
            {SECURITY_QUESTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
          </Field>

          <Field label="Security answer" value={formCrear.security_answer}
            onChange={changeCrear("security_answer")} onBlur={() => touchCrear("security_answer")}
            error={errorsCrear.security_answer} touched={touchedCrear.security_answer} />

          <Button variant="warning" className="w-100" onClick={handleCrear}>Create</Button>
          {apiError && <p className="text-danger text-center mt-2">{apiError}</p>}
        </Modal.Body>
      </Modal>

      {/* MODAL EDITAR */}
      <Modal show={showEditar} onHide={() => setShowEditar(false)} centered>
        <Modal.Header closeButton style={headerStyle}>
          <Modal.Title>Update user</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyle}>
          <Field label="Full name" value={formEditar.nombre}
            onChange={changeEditar("nombre")} onBlur={() => touchEditar("nombre")}
            error={errorsEditar.nombre} touched={touchedEditar.nombre} />

          <Field label="Email" type="email" value={formEditar.email}
            onChange={changeEditar("email")} onBlur={() => touchEditar("email")}
            error={errorsEditar.email} touched={touchedEditar.email} />

          <Field label="New password (leave empty to keep current)" type="password" value={formEditar.password}
            onChange={changeEditar("password")} onBlur={() => touchEditar("password")}
            error={errorsEditar.password} touched={touchedEditar.password} />

          <Field label="Phone" value={formEditar.telefono}
            onChange={changeEditar("telefono")} onBlur={() => touchEditar("telefono")}
            error={errorsEditar.telefono} touched={touchedEditar.telefono} />

          {formEditar.rol !== "administrador" && (
            <Field as="select" label="Location" value={formEditar.sede_id}
              onChange={changeEditar("sede_id")} onBlur={() => touchEditar("sede_id")}
              error={errorsEditar.sede_id} touched={touchedEditar.sede_id}>
              <option value="">Select location</option>
              {SEDES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Field>
          )}

          <Field as="select" label="Security question" value={formEditar.security_question}
            onChange={changeEditar("security_question")} onBlur={() => touchEditar("security_question")}
            error={errorsEditar.security_question} touched={touchedEditar.security_question}>
            <option value="">Select a security question</option>
            {SECURITY_QUESTIONS.map((q) => <option key={q} value={q}>{q}</option>)}
          </Field>

          <Field label="New security answer (leave empty to keep current)" value={formEditar.security_answer}
            onChange={changeEditar("security_answer")} onBlur={() => touchEditar("security_answer")}
            error={errorsEditar.security_answer} touched={touchedEditar.security_answer} />

          <Button variant="warning" className="w-100" onClick={handleEditar}>Update</Button>
          {apiError && <p className="text-danger text-center mt-2">{apiError}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}
