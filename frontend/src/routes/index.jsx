import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Components
import ProtectedRoute from "../components/ProtectedRoute";

const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const IndexLayout = lazy(() => import("../layouts/indexLayout"));
const Homes = lazy(() => import("../pages/index/index"));
const Services = lazy(() => import("../pages/index/service"));
const ServiceDetail = lazy(() => import("../pages/index/ServiceDetail"));
const APropos = lazy(() => import("../pages/index/A_propos"));
const Direction = lazy(() => import("../pages/index/direction"));
const Certifications = lazy(() => import("../pages/index/certification"));
const Contact = lazy(() => import("../pages/index/contact"));
const Portfolios = lazy(() => import("../pages/index/portfolio"));
const Galerie = lazy(() => import("../pages/index/galerie"));
const ProduitDetail = lazy(() => import("../pages/index/ProduitDetail"));
const Journal = lazy(() => import("../pages/index/Journal"));
const ActualiteDetail = lazy(() => import("../pages/index/ActualiteDetail"));
const Panier = lazy(() => import("../pages/index/Panier"));
const ChristmasInTheBush = lazy(() => import("../pages/index/ChristmasInTheBush"));
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Users = lazy(() => import("../pages/admin/Users"));
const Messages = lazy(() => import("../pages/admin/message"));
const Portfolio = lazy(() => import("../pages/admin/portfolio"));
const GalerieAdmin = lazy(() => import("../pages/admin/galerie"));
const JournalAdmin = lazy(() => import("../pages/admin/journal"));
const CarnetAdress = lazy(() => import("../pages/admin/carnetAdress"));
const Settings = lazy(() => import("../pages/admin/Settings"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading" role="status" aria-label="Loading page" />}>
        <Routes>

        {/* ROUTES PUBLIQUES — Layout avec Navbar + Footer */}
        <Route path="/" element={<IndexLayout />}>
          <Route index element={<Homes />} />
          <Route path="services" element={<Services />} />
          <Route path="galerie" element={<Galerie />} />
          <Route path="articles" element={<Galerie />} />
          <Route path="boutique" element={<Galerie />} />
          <Route path="panier" element={<Panier />} />
          <Route path="articles/:id" element={<ProduitDetail />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:id" element={<ActualiteDetail />} />
          <Route path="services/:id" element={<ServiceDetail />} />
          <Route path="about" element={<APropos />} />
          <Route path="direction" element={<Direction />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="contact" element={<Contact />} />
          <Route path="portfolios" element={<Portfolios />} />
          <Route path="christmas-in-the-bush-2026" element={<ChristmasInTheBush />} />

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
          <Route path="journal" element={<JournalAdmin />} />
          <Route path="carnetAdress" element={<CarnetAdress />} />
          <Route path="settings" element={<Settings />} />
          {/* <Route path="locations" element={<Locations />} /> */}
          {/* <Route path="profile" element={<InfoUser />} /> */}
        </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;