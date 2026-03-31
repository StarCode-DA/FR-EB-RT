import NavbarComponent from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminPage() {
  return (
    <div>
      <NavbarComponent />

      <div className="container mt-4">
        <h1 className="text-warning">Admin Dashboard</h1>
        <p className="text-white">Welcome, admin.</p>
      </div>

      <Footer />
    </div>
  );
}