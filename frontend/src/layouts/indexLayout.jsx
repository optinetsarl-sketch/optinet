import { Outlet } from "react-router-dom";
import Navbar from "../components/index/sedebar";
import Footer from "../components/index/footer";
import "../pages/styles_admin/index.css";

export default function IndexLayout() {
  return (
    <div className="index-layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENU PRINCIPAL */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}