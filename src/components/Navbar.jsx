import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function NavbarComponent() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Navbar style={{backgroundColor: "#111", boxShadow: "0 3px 10px 3px rgba(255, 193, 7, 0.4)"}}>
      <Container>
        <Navbar.Brand className="fw-bold text-warning fs-4">
          <img src="/luna.png" alt="luna" width={50} className="align-middle" /> Eclipse Bar
        </Navbar.Brand>

        <Nav className="me-auto">
          {/*  HOME */}
          <Nav.Link as={Link} to="/" className="text-white fw-semibold">
            Home
          </Nav.Link>

          {/*  NO LOGUEADO */}
          {!token && (
            <Nav.Link as={Link} to="/login" className="text-white fw-semibold">
              Login
            </Nav.Link>
          )}

          {/*  ADMIN */}
          {token && role === "ADMIN" && (
            <Nav.Link as={Link} to="/products" className="text-white fw-semibold">
              Products
            </Nav.Link>
          )}

          {/*  MESERO */}
          {token && role === "MESERO" && (
            <Nav.Link as={Link} to="/mesero" className="text-white fw-semibold">
              Mesero
            </Nav.Link>
          )}

          {/*  CAJERO */}
          {token && role === "CAJERO" && (
            <Nav.Link as={Link} to="/cajero" className="text-white fw-semibold">
              Cajero
            </Nav.Link>
          )}
        </Nav>

        {/*  LOGOUT */}
        {token && (
          <Nav>
            <Nav.Link onClick={logout} className="text-warning fw-semibold">
              Log Out
            </Nav.Link>
          </Nav>
        )}
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;