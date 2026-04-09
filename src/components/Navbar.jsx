import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

function NavbarComponent() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar style={{ backgroundColor: "#111", borderBottom: "1px solid #ffc107", boxShadow: "0 3px 10px rgba(255, 193, 7, 0.4)" }}>
      <Container>
        <Navbar.Brand as={Link} to={"/home"} className="fw-bold text-warning fs-4">
          <img src="/luna.png" alt="luna" width={50} className="align-middle" /> Eclipse Bar
        </Navbar.Brand>
        <Nav className="me-auto">
          {hasPermission('home.view') && (
            <Nav.Link as={Link} to="/home" className="text-white fw-semibold">Home</Nav.Link>
          )}
          {hasPermission('inventarios.view') && (
            <Nav.Link as={Link} to="/inventory" className="text-white fw-semibold">Inventory</Nav.Link>
          )}
          {hasPermission('productos.manage') && (
            <Nav.Link as={Link} to="/products" className="text-white fw-semibold">Products</Nav.Link>
          )}
          {hasPermission('usuarios.manage') && (
            <Nav.Link as={Link} to="/users" className="text-white fw-semibold">Users</Nav.Link>
          )}
        </Nav>
        <Nav className="d-flex align-items-center">
          <NavDropdown
            title={<span className="text-warning fw-semibold">{user?.nombre}</span>}
            id="user-dropdown"
            align="end"
          >
            <NavDropdown.Item
              onClick={handleLogout}
              className="d-flex justify-content-center"
              style={{ backgroundColor: "#111" }}
            >
              <button className="btn btn-outline-warning btn-sm fw-semibold w-100">
                ⏻ Log Out
              </button>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;