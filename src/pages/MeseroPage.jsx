import NavbarComponent from "../components/Navbar";
import Footer from "../components/Footer";

export default function MeseroPage() {
  return (
    <div>
      <NavbarComponent />

      <div className="container mt-4">
        <h1 className="text-warning">Waiter Dashboard</h1>
        <p className="text-white">Welcome, waiter.</p>
      </div>

      <Footer />
    </div>
  );
}