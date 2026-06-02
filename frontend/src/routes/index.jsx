import { BrowserRouter, Routes, Route } from "react-router-dom";

// import AdminLayout from "../layouts/AdminLayout";
// import Login from "../pages/Login";
import Index from "../pages/index";
// import Dashboard from "../pages/admin/Dashboard";
// import Users from "../pages/admin/Users";
// import Locations from "../pages/admin/Locations";
// import Settings from "../pages/admin/Settings";
// import InfoUser from "../pages/admin/InfoUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />  
        {/* <Route path="/login" element={<Login />} /> */}
        {/* ADMIN ROUTES */}
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route path="login" element={<Login />} />  
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="locations" element={<Locations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<InfoUser />} />
        </Route>*/}
      </Routes> 

    </BrowserRouter>
  );
}

export default App;