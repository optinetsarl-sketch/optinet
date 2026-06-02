import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      {/* MENU */}
      <Sidebar />

      {/* CONTENU PRINCIPAL */}
      <div style={{ flex: 1, marginLeft: "260px", minHeight: "100vh" }}>
        <Header />
        <main style={{ padding: "20px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}