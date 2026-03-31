import NavbarComponent from "../components/Navbar";
import Footer from "../components/Footer";

export default function CajeroPage() {
  return (
    <div>
      <NavbarComponent />

      <div className="container mt-4">
        <h1 className="text-warning">Cashier Dashboard</h1>
        <p className="text-white">Welcome, cashier.</p>
      </div>

      <Footer />
    </div>
  );
}