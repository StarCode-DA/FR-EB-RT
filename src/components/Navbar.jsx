import { Navbar, Nav, Container } from "react-bootstrap";

function NavbarComponent() {
  return (
    <Navbar style={{backgroundColor: "#111", boxShadow: "0 3px 10px 3px rgba(255, 193, 7, 0.4)"}}>
      <Container>
        <Navbar.Brand className="fw-bold text-warning fs-4">
          <img src="/luna.png" alt="luna" width={50} className="align-middle" /> Eclipse Bar
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/" className="text-white fw-semibold">Home</Nav.Link>
          <Nav.Link href="/login" className="text-white fw-semibold">Login</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;