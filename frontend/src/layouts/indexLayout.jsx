import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/index/sedebar";
import Footer from "../components/index/footer";
import JournalPopup from "../components/index/JournalPopup";
import { trackVisite } from "../services/authService";
import "../pages/styles_admin/index.css";

export default function IndexLayout() {
  const location = useLocation();

  // Compteur de visiteurs : signale chaque page publique consultée (anonyme)
  useEffect(() => {
    trackVisite(location.pathname);
  }, [location.pathname]);

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

      {/* POP-UP promo Journal (aléatoire) */}
      <JournalPopup />
    </div>
  );
}