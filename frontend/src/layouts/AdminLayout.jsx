import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import { MessageProvider } from "../context/MessageContext";
import useSessionTimeout from "../hooks/useSessionTimeout";

export default function AdminLayout() {
  // Monitorer l'inactivité et logout après 30 minutes
  useSessionTimeout();
  return (
    <MessageProvider>
      <div className="admin-layout" style={{ minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
        <Sidebar />
        {/* CONTENU PRINCIPAL */}
        <div
          className="admin-layout__content"
          style={{
            marginLeft: "268px",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />
          <main
            className="admin-layout__main"
            style={{
              flex: 1,
              padding: "28px 30px",
              backgroundColor: "#f0f4f8",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </MessageProvider>
  );
}