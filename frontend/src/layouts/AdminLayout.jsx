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
      <div className="admin-layout" style={{ minHeight: "10vh", backgroundColor: "#f4f7fa" }}>
        {/* CONTENU PRINCIPAL */}
        <div 
          className="admin-layout__content" 
          style={{ 
            marginLeft: "260px",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh"
          }}
        >
          <Sidebar />
          <Header />
          
          <main 
            style={{ 
              flex: 1, 
              padding: "24px",
              backgroundColor: "#71b7c3ff"
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </MessageProvider>
  );
}