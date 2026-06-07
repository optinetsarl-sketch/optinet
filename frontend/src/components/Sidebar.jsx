import { NavLink } from "react-router-dom";
import logo from "../assets/logo-Optinet-sokode.png";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Utilisateurs" },
  { to: "/admin/message", label: "Messages" },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/galerie", label: "Galerie" },
  { to: "/admin/carnetAdress", label: "Carnet d'Adresses" },
  // { to: "/admin/logout", label: "Déconnexion" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar" role="navigation" aria-label="Navigation principale">
      <div className="sidebar__brand">
        <img
          src={logo}
          alt="Logo Optinet"
          className="sidebar__logo-img"
        />
      </div>
      <div className="sidebar__nav">
        <ul className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label }) => (
            <li key={to} className="sidebar__nav-item">
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? " sidebar__link--active" : ""}`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;