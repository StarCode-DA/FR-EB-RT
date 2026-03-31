import { useEffect, useState } from "react";
import NavbarComponent from "../components/Navbar";
import { productService } from "../services/api";


export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    costo: "",
    precio: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadProducts = async () => {
    const res = await productService.getProducts(search, category);
    setProducts(res.data);
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  const handleSubmit = async () => {
    const data = {
      name: form.nombre,
      category: form.categoria,
      cost: Number(form.costo),
      price: Number(form.precio)
    };

    if (editingId) {
      await productService.updateProduct(editingId, data);
    } else {
      await productService.createProduct(data);
    }

    setForm({ nombre: "", categoria: "", costo: "", precio: "" });
    setEditingId(null);
    setShowModal(false);
    loadProducts();
  };

  const handleEdit = (product) => {
    setForm({
      nombre: product.name,
      categoria: product.category,
      costo: product.cost,
      precio: product.price
    });
    setEditingId(product.id);
    setShowModal(true);
  };

  return (
    <div>
      <NavbarComponent />

      <div className="container mt-4">
        <h2 className="text-warning">Products</h2>

        {/* SEARCH */}
        <input
          className="form-control mb-2"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY FILTER */}
        <select
          className="form-control mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Drinks">Drinks</option>
          <option value="Liquor">Liquor</option>
        </select>

        <button
          className="btn btn-success mb-3 ms-2"
           style={{
            backgroundColor: "#FFD700",
            borderColor: "#FFD700",
            color: "black",
            fontWeight: "bold"
            }}
          onClick={() => {
            setForm({ nombre: "", categoria: "", costo: "", precio: "" });
            setEditingId(null);
            setShowModal(true);
          }}
        >
          Create Product
        </button>

        {/* TABLE */}
        <table
          className="table table-dark"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th style={{ borderRight: "1px solid rgba(255, 215, 0, 0.4)" }}>
                Name
              </th>
              <th style={{ borderRight: "1px solid rgba(255, 215, 0, 0.4)" }}>
                Category
              </th>
              <th style={{ borderRight: "1px solid rgba(255, 215, 0, 0.4)" }}>
                Cost
              </th>
              <th style={{ borderRight: "1px solid rgba(255, 215, 0, 0.4)" }}>
                Price
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ borderRight: "1px solid rgba(255, 215, 0, 0.2)" }}>
                  {p.name}
                </td>
                <td style={{ borderRight: "1px solid rgba(255, 215, 0, 0.2)" }}>
                  {p.category}
                </td>
                <td style={{ borderRight: "1px solid rgba(255, 215, 0, 0.2)" }}>
                  {p.cost}
                </td>
                <td style={{ borderRight: "1px solid rgba(255, 215, 0, 0.2)" }}>
                  {p.price}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(3px)"
          }}
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                background: "linear-gradient(to bottom, #000000, #1a1a1a)",
                color: "#fff",
                border: "1px solid #444",
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Estrellas decorativas */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "radial-gradient(2px 2px at 10% 20%, white, transparent), radial-gradient(1px 1px at 50% 40%, white, transparent), radial-gradient(1.5px 1.5px at 80% 70%, white, transparent)",
                  opacity: 0.3,
                  pointerEvents: "none"
                }}
              ></div>

              <div className="modal-header">
                <h5 className="modal-title"
                style={{ color: "#FFD700" }}  // dorado
                >
                  {editingId ? "Update Product" : "Create Product"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({ ...form, nombre: e.target.value })
                  }
                />
                <select
                  className="form-control mb-2"
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({ ...form, categoria: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Food">Food</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Liquor">Liquor</option>
                </select>
                <input
                  className="form-control mb-2"
                  placeholder="Cost"
                  type="number"
                  step={500}
                  value={form.costo}
                  onChange={(e) => setForm({ ...form, costo: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Price"
                  type="number"
                  step={500}
                  value={form.precio}
                  onChange={(e) => setForm({ ...form, precio: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn"
                  style={{
                  backgroundColor: "#FFD700",
                  borderColor: "#FFD700",
                  color: "black",
                  fontWeight: "bold"
                  }}
                   onClick={handleSubmit}
                  >
                    {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}