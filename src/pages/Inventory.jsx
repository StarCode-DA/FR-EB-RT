import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { inventoryService, productService } from "../services/api";

function Inventory() {
  const rol = localStorage.getItem("rol");
  const sedeIdUsuario = parseInt(localStorage.getItem("sede_id"));
  const [category, setCategory] = useState("");
  // Map de IDs de sede a nombres para mostrar en el título
  const sedeNombres = { 1: "Galerías", 2: "Restrepo", 3: "Zona T" };
  const [sedeSeleccionada, setSedeSeleccionada] = useState(
    rol === "administrador" ? 1 : sedeIdUsuario
  );
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ product_id: "", stock: "" });
  const [stockForm, setStockForm] = useState({ stock: "" });
  const [errorForm, setErrorForm] = useState("");
  const [errorEdit, setErrorEdit] = useState("");
  const [search, setSearch] = useState("");
  const [searchProducto, setSearchProducto] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;
  const loadInventory = async () => {
    const res = await inventoryService.getInventory(sedeSeleccionada);
    setInventory(res.data);
  };
  const loadProducts = async () => {
    const res = await productService.getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    loadInventory();
    loadProducts();
  }, [sedeSeleccionada]);

  useEffect(() => { setPaginaActual(1); }, [search, sedeSeleccionada, category]);

  // Enriquecer inventario con datos de producto
  const inventoryEnriquecido = inventory.map((item) => {
    const product = products.find((p) => p.id === item.product_id);
    return {
      ...item,
      name: product?.name ?? `Product #${item.product_id}`,
      unit: product?.unit ?? "-",
      category: product?.category ?? "-",
    };
  });
  const filtrado = inventoryEnriquecido.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || item.category === category)
  );
  // Paginación
  const totalPaginas = Math.ceil(filtrado.length / itemsPorPagina);
  const paginado = filtrado.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina
  );
  const productosDisponibles = products.filter(
    (p) => p.activo && !inventory.some((i) => i.product_id === p.id)
  );
  const validarCrear = () => {
    if (!form.product_id) return "Select a product";
    if (form.stock === "" || Number(form.stock) < 0) return "Stock must be 0 or greater";
    return null;
  };
  const validarEditar = () => {
    if (stockForm.stock === "" || Number(stockForm.stock) < 0) return "Stock must be 0 or greater";
    return null;
  };
  const handleCrear = async () => {
    const error = validarCrear();
    if (error) { setErrorForm(error); return; }
    setErrorForm("");
    try {
      await inventoryService.createInventory({
        product_id: parseInt(form.product_id),
        sede_id: sedeSeleccionada,
        stock: Number(form.stock)
      });
      setShowModal(false);
      loadInventory();
    } catch (err) {
      setErrorForm(err.response?.data?.detail ?? "Error creating item");
    }
  };
  const handleAbrirEditar = (item) => {
    setEditingItem(item);
    setStockForm({ stock: item.stock });
    setErrorEdit("");
    setShowEditModal(true);
  };
  // Actualizar stock
  const handleActualizarStock = async () => {
    const error = validarEditar();
    if (error) { setErrorEdit(error); return; }
    setErrorEdit("");
    try {
      await inventoryService.updateStock(editingItem.id, { stock: Number(stockForm.stock) });
      setShowEditModal(false);
      loadInventory();
    } catch (err) {
      setErrorEdit(err.response?.data?.detail ?? "Error updating stock");
    }
  };
  // Toggle activo/inactivo
  const handleToggleActivo = async (item) => {
    try {
      await inventoryService.toggleActivo(item.id);
      loadInventory();
    } catch (err) {
      console.error("Error toggling item", err);
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-warning">
            Inventory — {sedeNombres[sedeSeleccionada]}
          </h4>
          {(rol === "administrador" || rol === "cajero") && (
            <Button variant="warning" onClick={() => {
              setForm({ product_id: "", stock: "" });
              setSearchProducto("");
              setErrorForm("");
              setShowModal(true);
            }}>
              + Add product
            </Button>
          )}
        </div>

        {/* Selector de sede — solo admin */}
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

        {/* Búsqueda y filtrado por categoría */}
        <div className="d-flex gap-3 mb-3">
          <input
            className="form-control"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
            <option value="Liquor">Liquor</option>
          </select>
        </div>

        {/* Tabla */}
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>Product</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginado.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-warning py-4">
                  No products in inventory
                </td>
              </tr>
            ) : (
              paginado.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.category}</td>
                  <td>{item.stock}</td>
                  <td className="text-center">{item.activo ? "✅" : "❌"}</td>
                  <td>
                    <Button variant="outline-warning" size="sm" onClick={() => handleAbrirEditar(item)}>
                      Update stock
                    </Button>
                    {(rol === "administrador" || rol === "cajero") && (
                      <Button
                        variant={item.activo ? "outline-danger" : "outline-success"}
                        size="sm"
                        style={{ marginLeft: "8px" }}
                        onClick={() => handleToggleActivo(item)}
                      >
                        {item.activo ? "Deactivate" : "Activate"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginador */}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <Button variant="outline-warning" size="sm"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((p) => p - 1)}>
            ← Prev
          </Button>
          <span className="text-warning">{paginaActual} / {totalPaginas || 1}</span>
          <Button variant="outline-warning" size="sm"
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            onClick={() => setPaginaActual((p) => p + 1)}>
            Next →
          </Button>
        </div>
      </div>

      {/* MODAL — Agregar producto al inventario */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#111", color: "#ffc107", borderBottom: "1px solid #ffc107" }}>
          <Modal.Title>Add product</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#111" }}>
          <input
            className="form-control mb-2"
            placeholder="Search product..."
            value={searchProducto}
            onChange={(e) => {
              setSearchProducto(e.target.value);
              setForm({ ...form, product_id: "" });
            }}
          />

          {searchProducto.trim() && (
            <div
              className="mb-3"
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ffc107",
                borderRadius: "4px"
              }}
            >
              {productosDisponibles
                .filter((p) => p.name.toLowerCase().includes(searchProducto.toLowerCase()))
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setForm({ ...form, product_id: p.id });
                      setSearchProducto(p.name);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor: form.product_id === p.id ? "#ffc107" : "#1a1a1a",
                      color: form.product_id === p.id ? "#000" : "#fff",
                    }}
                    onMouseEnter={(e) => {
                      if (form.product_id !== p.id)
                        e.currentTarget.style.backgroundColor = "#333";
                    }}
                    onMouseLeave={(e) => {
                      if (form.product_id !== p.id)
                        e.currentTarget.style.backgroundColor = "#1a1a1a";
                    }}
                  >
                    {p.name} <span style={{ color: "#ffffff", fontSize: "0.8rem" }}>({p.unit})</span>
                  </div>
                ))}
              {productosDisponibles.filter((p) =>
                p.name.toLowerCase().includes(searchProducto.toLowerCase())
              ).length === 0 && (
                  <div className="text-center text-warning py-2" style={{ fontSize: "0.85rem" }}>
                    No products found
                  </div>
                )}
            </div>
          )}

          <input
            className="form-control mb-3"
            placeholder="Initial stock"
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <Button variant="warning" className="w-100" onClick={handleCrear}>
            Add
          </Button>
          {errorForm && <p className="text-danger text-center mt-2">{errorForm}</p>}
        </Modal.Body>
      </Modal>

      {/* MODAL — Actualizar stock */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#111", color: "#ffc107", borderBottom: "1px solid #ffc107" }}>
          <Modal.Title>Update stock — {editingItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#111" }}>
          <p className="text-warning mb-2">Current stock: {editingItem?.stock}</p>
          <input
            className="form-control mb-3"
            placeholder="New stock"
            type="number"
            min={0}
            value={stockForm.stock}
            onChange={(e) => setStockForm({ stock: e.target.value })}
          />
          <Button variant="warning" className="w-100" onClick={handleActualizarStock}>
            Update
          </Button>
          {errorEdit && <p className="text-danger text-center mt-2">{errorEdit}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Inventory;