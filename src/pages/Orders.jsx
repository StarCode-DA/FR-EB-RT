import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { ordersService } from "../services/api";

function Orders() {
  const rol = localStorage.getItem("rol");
  const sedeIdUsuario = parseInt(localStorage.getItem("sede_id"));
  const usuarioId = parseInt(localStorage.getItem("usuario_id"));
  const nombreUsuario = localStorage.getItem("nombre_usuario") || "";

  const sedeNombres = { 1: "Galerías", 2: "Restrepo", 3: "Zona T" };

  const [sedeSeleccionada, setSedeSeleccionada] = useState(
    rol === "administrador" ? 1 : sedeIdUsuario
  );
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;
  const [showModal, setShowModal] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [loading, setLoading] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");
  const [cedulaCliente, setCedulaCliente] = useState("");

  const loadOrders = async () => {
    try {
      const res = await ordersService.getOrders(sedeSeleccionada);
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders", err);
    }
  };

  useEffect(() => { loadOrders(); }, [sedeSeleccionada]);
  useEffect(() => { setPaginaActual(1); }, [search, sedeSeleccionada]);

  const filtrado = orders.filter((item) =>
    item.status.toLowerCase().includes(search.toLowerCase())
  );
  const totalPaginas = Math.ceil(filtrado.length / itemsPorPagina);
  const paginado = filtrado.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );

  const handleCrear = async () => {
    if (!nombreCliente.trim()) { setErrorForm("Client name is required"); return; }
    if (!/^\d{10}$/.test(cedulaCliente.trim())) { setErrorForm("Client ID must be exactly 10 digits"); return; }

    setLoading(true);
    setErrorForm("");
    try {
      await ordersService.createOrder({
        usuario_id: usuarioId,
        sede_id: sedeSeleccionada,
        nombre_cliente: nombreCliente.trim(),
        cedula_cliente: cedulaCliente.trim(),
        nombre_usuario: nombreUsuario,
      });
      setShowModal(false);
      setNombreCliente("");
      setCedulaCliente("");
      loadOrders();
    } catch (err) {
      console.error("Error creating order", err);
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((e) => e.msg).join(", ")
        : typeof detail === "string"
        ? detail
        : "Error creating order";
      setErrorForm(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-warning">Orders — {sedeNombres[sedeSeleccionada]}</h4>
          <Button variant="warning" onClick={() => {
            setErrorForm("");
            setNombreCliente("");
            setCedulaCliente("");
            setShowModal(true);
          }}>
            + Create Order
          </Button>
        </div>

        {rol === "administrador" && (
          <div className="d-flex gap-3 mb-3">
            {[1, 2, 3].map((id) => (
              <Button
                key={id}
                variant={sedeSeleccionada === id ? "warning" : "outline-warning"}
                size="sm"
                onClick={() => setSedeSeleccionada(id)}
              >
                {sedeNombres[id]}
              </Button>
            ))}
          </div>
        )}

        <div className="d-flex gap-3 mb-3">
          <input
            className="form-control"
            placeholder="Search by status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Created by</th>
              <th>Client</th>
              <th>Client ID</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginado.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-warning py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              paginado.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nombre_usuario}</td>
                  <td>{item.nombre_cliente}</td>
                  <td>{item.cedula_cliente}</td>
                  <td>{sedeNombres[item.sede_id]}</td>
                  <td>
                    <span className={`badge ${item.status === "ABIERTO" ? "bg-warning text-dark" : "bg-secondary"}`}>
                      {item.status === "ABIERTO" ? "OPEN" : "CLOSED"}
                    </span>
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#111", color: "#ffc107" }}>
          <Modal.Title>Create Order</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#111" }}>
          <p className="text-warning mb-3">
            Location: <strong>{sedeNombres[sedeSeleccionada]}</strong><br />
            Created by: <strong>{rol} — {nombreUsuario}</strong>
          </p>
          <input
            className="form-control mb-3"
            placeholder="Client name"
            value={nombreCliente}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
          <input
            className="form-control mb-3"
            placeholder="Client ID number (10 digits)"
            value={cedulaCliente}
            maxLength={10}
            onChange={(e) => setCedulaCliente(e.target.value.replace(/\D/g, ""))}
          />
          <Button variant="warning" className="w-100" onClick={handleCrear} disabled={loading}>
            {loading ? "Creating..." : "Confirm Create"}
          </Button>
          {errorForm && <p className="text-danger text-center mt-2">{errorForm}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Orders;