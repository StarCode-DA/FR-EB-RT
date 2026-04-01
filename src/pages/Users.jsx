import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { userService } from "../services/api";

function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [showCrear, setShowCrear] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtreSede, setFiltreSede] = useState("");
  const [formCrear, setFormCrear] = useState({
    email: "", password: "", nombre: "", telefono: "",
    rol: "", sede_id: "", security_question: "", security_answer: ""
  });
  const [formEditar, setFormEditar] = useState({
    email: "", password: "", nombre: "", telefono: "",
    rol: "mesero", sede_id: "", security_question: "", security_answer: ""
  });
  const [errorCrear, setErrorCrear] = useState("");
  const [errorEditar, setErrorEditar] = useState("");
  const cargarUsuarios = async () => {
    try {
      const data = await userService.listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error("Error loading users", err);
    }
  };
  useEffect(() => { cargarUsuarios(); }, []);
  {/* Validaciones al crear usuario */}
  const validarCrear = () => {
    if (!formCrear.nombre.trim()) return "Full name is required";
    if (!formCrear.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formCrear.email)) return "Email must follow the format example@eclipsebar.com";
    if (!formCrear.password.trim()) return "Password is required";
    if (!formCrear.telefono.trim()) return "Phone number is required";
    if (!formCrear.rol) return "Role is required";
    if (formCrear.rol !== "administrador" && !formCrear.sede_id) return "Location is required";
    if (!formCrear.security_question.trim()) return "Security question is required";
    if (!formCrear.security_answer.trim()) return "Security answer is required";
    return null;
  };
  {/* Manejo de creación de usuario */}
  const handleCrear = async () => {
    const error = validarCrear();
    if (error) { setErrorCrear(error); return; }
    setErrorCrear("");
    try {
      await userService.crearUsuario({
        ...formCrear,
        sede_id: formCrear.sede_id ? parseInt(formCrear.sede_id) : null
      });
      setShowCrear(false);
      await cargarUsuarios();
    } catch (err) {
      setErrorCrear(
        typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response?.data?.detail)
      );
    }
  };
  {/* Abrir modal de edición con datos del usuario seleccionado */}
  const handleAbrirEditar = (usuario) => {
    setUsuarioEditandoId(usuario.id);
    setFormEditar({
      email: usuario.email,
      password: "",
      nombre: usuario.nombre,
      telefono: usuario.telefono || "",
      rol: usuario.rol,
      sede_id: usuario.sede_id || "",
      security_question: usuario.security_question || "",
      security_answer: ""
    });
    setErrorEditar("");
    setShowEditar(true);
  };
  {/* Validaciones al editar usuario */}
  const validarEditar = () => {
    if (!formEditar.nombre.trim()) return "Full name is required";
    if (!formEditar.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formEditar.email)) return "Email must follow the format example@eclipsebar.com";
    if (!formEditar.telefono.trim()) return "Phone number is required";
    if (formEditar.rol !== "administrador" && !formEditar.sede_id) return "Location is required";
    if (!formEditar.security_question.trim()) return "Security question is required";
    return null;
  };
  {/* Manejo de actualización de usuario */}
  const handleEditar = async () => {
    const error = validarEditar();
    if (error) { setErrorEditar(error); return; }
    setErrorEditar("");
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
      setErrorEditar(
        typeof err.response?.data?.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response?.data?.detail)
      );
    }
  };
  {/* Manejo de activación/desactivación de usuario */}
  const handleToggleActivo = async (usuario) => {
    try {
      await userService.toggleActivo(usuario.id);
      await cargarUsuarios();
    } catch (err) {
      console.error("Error cambiando estado del usuario", err);
    }
  };
  {/* Filtrado de usuarios según búsqueda por nombre y sede seleccionada */}
  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideNombre = u.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideSede = filtreSede === "" || u.sede_id === parseInt(filtreSede) || (filtreSede === "todas" && u.rol === "administrador");
    return coincideNombre && coincideSede;
  });

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-warning">Users</h4>
          <Button variant="warning" onClick={() => {
            setFormCrear({ email: "", password: "", nombre: "", telefono: "", rol: "", sede_id: "", security_question: "", security_answer: "" });
            setErrorCrear("");
            setShowCrear(true);
          }}>
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
            <option value="1">Galerías</option>
            <option value="2">Restrepo</option>
            <option value="3">Zona T</option>
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
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.telefono ?? "-"}</td>
                <td>{{ administrador: "Administrator", cajero: "Cashier", mesero: "Waiter" }[u.rol]}</td>
                <td>{u.sede}</td>
                <td className="text-center">{u.activo ? "✅" : "❌"}</td>
                <td>
                  <Button variant="outline-warning" size="sm" onClick={() => handleAbrirEditar(u)}>
                    Edit
                  </Button>
                  <Button variant={u.activo ? "outline-danger" : "outline-success"} size="sm" style={{ marginLeft: "8px" }} onClick={() => handleToggleActivo(u)}>
                    {u.activo ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* MODAL CREAR */}
      <Modal show={showCrear} onHide={() => setShowCrear(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#111", color: "#ffc107", borderBottom: "1px solid #ffc107" }}>
          <Modal.Title>Create user</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#111" }}>
          <input className="form-control mb-3" placeholder="Full name" value={formCrear.nombre}
            onChange={(e) => setFormCrear((p) => ({ ...p, nombre: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Email" type="email" value={formCrear.email}
            onChange={(e) => setFormCrear((p) => ({ ...p, email: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Password" type="password" value={formCrear.password}
            onChange={(e) => setFormCrear((p) => ({ ...p, password: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Phone" value={formCrear.telefono}
            onChange={(e) => setFormCrear((p) => ({ ...p, telefono: e.target.value }))} />
          <select className="form-control mb-3" value={formCrear.rol}
            onChange={(e) => setFormCrear((p) => ({ ...p, rol: e.target.value }))}>
            <option value="">Select role</option>
            <option value="mesero">Waiter</option>
            <option value="cajero">Cashier</option>
            <option value="administrador">Administrator</option>
          </select>
          {formCrear.rol !== "administrador" && (
            <select className="form-control mb-3" value={formCrear.sede_id}
              onChange={(e) => setFormCrear((p) => ({ ...p, sede_id: e.target.value }))}>
              <option value="">Select location</option>
              <option value="1">Galerías</option>
              <option value="2">Restrepo</option>
              <option value="3">Zona T</option>
            </select>
          )}
          <input className="form-control mb-3" placeholder="Security question" value={formCrear.security_question}
            onChange={(e) => setFormCrear((p) => ({ ...p, security_question: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Security answer" value={formCrear.security_answer}
            onChange={(e) => setFormCrear((p) => ({ ...p, security_answer: e.target.value }))} />
          <Button variant="warning" className="w-100" onClick={handleCrear}>Create user</Button>
          {errorCrear && <p className="text-danger text-center mt-2">{errorCrear}</p>}
        </Modal.Body>
      </Modal>
      {/* MODAL EDITAR */}
      <Modal show={showEditar} onHide={() => setShowEditar(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#111", color: "#ffc107", borderBottom: "1px solid #ffc107" }}>
          <Modal.Title>Edit user</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#111" }}>
          <input className="form-control mb-3" placeholder="Full name" value={formEditar.nombre}
            onChange={(e) => setFormEditar((p) => ({ ...p, nombre: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Email" type="email" value={formEditar.email}
            onChange={(e) => setFormEditar((p) => ({ ...p, email: e.target.value }))} />
          <input className="form-control mb-3" placeholder="New password (leave empty to not change)" type="password" value={formEditar.password}
            onChange={(e) => setFormEditar((p) => ({ ...p, password: e.target.value }))} />
          <input className="form-control mb-3" placeholder="Phone" value={formEditar.telefono}
            onChange={(e) => setFormEditar((p) => ({ ...p, telefono: e.target.value }))} />
          {formEditar.rol !== "administrador" && (
            <select className="form-control mb-3" value={formEditar.sede_id}
              onChange={(e) => setFormEditar((p) => ({ ...p, sede_id: e.target.value }))}>
              <option value="">Select location</option>
              <option value="1">Galerías</option>
              <option value="2">Restrepo</option>
              <option value="3">Zona T</option>
            </select>
          )}
          <input className="form-control mb-3" placeholder="Security question" value={formEditar.security_question}
            onChange={(e) => setFormEditar((p) => ({ ...p, security_question: e.target.value }))} />
          <input className="form-control mb-3" placeholder="New security answer (leave empty to not change)" value={formEditar.security_answer}
            onChange={(e) => setFormEditar((p) => ({ ...p, security_answer: e.target.value }))} />
          <Button variant="warning" className="w-100" onClick={handleEditar}>Update user</Button>
          {errorEditar && <p className="text-danger text-center mt-2">{errorEditar}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Users;