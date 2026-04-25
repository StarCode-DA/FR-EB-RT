import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { productService } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    unidad: "",
    categoria: "",
    costo: "",
    precio: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 6;

  const loadProducts = async () => {
    const res = await productService.getProducts(search, category);
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  useEffect(() => { setPaginaActual(1); }, [search, category]);
  
  const [errorForm, setErrorForm] = useState("");
  const validar = () => {
    if (!form.nombre.trim()) return "Name is required";
    if (!form.unidad.trim()) return "Unit is required";
    if (!form.categoria) return "Category is required";
    if (!form.costo || Number(form.costo) <= 0) return "Cost must be greater than 0";
    if (!form.precio || Number(form.precio) <= 0) return "Price must be greater than 0";
    if (Number(form.precio) <= Number(form.costo)) return "Sale price must be greater than cost";
    return null;
};

  const handleSubmit = async () => {
    const error = validar();
    if (error) { setErrorForm(error); return; }
    setErrorForm("");
    const data = {
      name: form.nombre,
      unit: form.unidad,
      category: form.categoria,
      cost: Number(form.costo),
      price: Number(form.precio)
    };

    try {
      if (editingId) {
        await productService.updateProduct(editingId, data);
      } else {
        await productService.createProduct(data);
      }
      setForm({ nombre: "", unidad: "", categoria: "", costo: "", precio: "" });
      setEditingId(null);
      setShowModal(false);
      loadProducts();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setErrorForm(typeof detail === "string" ? detail : "Error saving product");
    }
};

  const handleEdit = (product) => {
    setErrorForm("");
    setForm({
      nombre: product.name,
      unidad: product.unit,
      categoria: product.category,
      costo: product.cost,
      precio: product.price
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleToggleActivo = async (product) => {
    try {
      await productService.toggleActivo(product.id);
      loadProducts();
    } catch (err) {
      console.error("Error cambiando estado del producto", err);
    }
  };

  const totalPaginas = Math.ceil(products.length / productosPorPagina);
  const productosPaginados = products.slice(
    (paginaActual - 1) * productosPorPagina,
    paginaActual * productosPorPagina
  );
  
  return (
    <div>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="text-warning">Products</h4>
          <Button variant="warning" onClick={() => {
            setForm({ nombre: "", unidad: "", categoria: "", costo: "", precio: "" });
            setErrorForm("");
            setEditingId(null);
            setShowModal(true);
          }}>
            + Create product
          </Button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="d-flex gap-3 mb-3">
          <input
            className="form-control"
            placeholder="Search by name..."
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

        {/* TABLE */}
        <table className="table table-dark table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Category</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productosPaginados.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-warning py-4">
                  No products found
                </td>
              </tr>
            ) : (
              productosPaginados.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.unit}</td>
                  <td>{p.category}</td>
                  <td>{p.cost}</td>
                  <td>{p.price}</td>
                  <td className="text-center">{p.activo ? "✅" : "❌"}</td>
                  <td>
                    <Button variant="outline-warning" size="sm" onClick={() => handleEdit(p)}>
                      Edit
                    </Button>
                    <Button
                      variant={p.activo ? "outline-danger" : "outline-success"}
                      size="sm"
                      style={{ marginLeft: "8px" }}
                      onClick={() => handleToggleActivo(p)}
                    >
                      {p.activo ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* PAGINADOR */}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <Button
            variant="outline-warning"
            size="sm"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual((p) => p - 1)}
          >
            ← Prev
          </Button>
          <span className="text-warning">
            {paginaActual} / {totalPaginas || 1}
          </span>
          <Button
            variant="outline-warning"
            size="sm"
            disabled={paginaActual === totalPaginas || totalPaginas === 0}
            onClick={() => setPaginaActual((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#111", color: "#ffc107", borderBottom: "1px solid #ffc107" }}>
          <Modal.Title>{editingId ? "Update product" : "Create product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#111" }}>
          <input
            className="form-control mb-3"
            placeholder="Name"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input
            className="form-control mb-3"
            placeholder="Unit (g, ml, unit, etc.)"
            value={form.unidad}
            onChange={(e) => setForm({ ...form, unidad: e.target.value })}
          />
          <select
            className="form-control mb-3"
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          >
            <option value="">Select category</option>
            <option value="Food">Food</option>
            <option value="Drinks">Drinks</option>
            <option value="Liquor">Liquor</option>
          </select>
          <input
            className="form-control mb-3"
            placeholder="Cost"
            type="number"
            step={500}
            value={form.costo}
            onChange={(e) => setForm({ ...form, costo: e.target.value })}
          />
          <input
            className="form-control mb-3"
            placeholder="Price"
            type="number"
            step={500}
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
          />
          <Button variant="warning" className="w-100" onClick={handleSubmit}>
            {editingId ? "Update" : "Create"}
          </Button>
          {errorForm && <p className="text-danger text-center mt-2">{errorForm}</p>}
        </Modal.Body>
      </Modal>
    </div>
  );
}
