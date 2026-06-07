import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import IndexLayout from "../layouts/indexLayout";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

// Pages publiques
import Homes from "../pages/index/index";
import Services from "../pages/index/service";
import ServiceDetail from "../pages/index/ServiceDetail";
import APropos from "../pages/index/A_propos";
import Direction from "../pages/index/direction";
import Certifications from "../pages/index/certification";
import Contact from "../pages/index/contact";
import Portfolios from "../pages/index/portfolio";
import Galerie from "../pages/index/galerie";

// Pages auth & admin
import Login from "../pages/Login";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Messages from "../pages/admin/message";
import Portfolio from "../pages/admin/portfolio";
import GalerieAdmin from "../pages/admin/galerie";
import CarnetAdress from "../pages/admin/carnetAdress";




// import Settings from "../pages/admin/Settings";
// import InfoUser from "../pages/admin/InfoUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROUTES PUBLIQUES — Layout avec Navbar + Footer */}
        <Route path="/" element={<IndexLayout />}>
          <Route index element={<Homes />} />
          <Route path="services" element={<Services />} />
          <Route path="galerie" element={<Galerie />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="about" element={<APropos />} />
          <Route path="direction" element={<Direction />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="contact" element={<Contact />} />
          <Route path="portfolios" element={<Portfolios />} />


        </Route>

        
        {/* PAGE LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ROUTES ADMIN PROTÉGÉES — Layout avec Sidebar + Header */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="message" element={<Messages />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="galerie" element={<GalerieAdmin />} />
          <Route path="carnetAdress" element={<CarnetAdress />} />
          {/* <Route path="locations" element={<Locations />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
          {/* <Route path="profile" element={<InfoUser />} /> */}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;