import { NavLink } from "react-router-dom";
import logo from "../assets/logoLogin.png";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/admin/dashboard",            label: "Dashboard" },
  { to: "/admin/users",       label: "Utilisateurs" },
  { to: "/admin/locations",   label: "Locations" },
  { to: "/admin/settings",    label: "Paramètres" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar" role="navigation" aria-label="Navigation principale">
      <div className="sidebar__brand">
        <img
          src={logo}
          alt="Logo XOHome"
          className="sidebar__logo-img"
        />
      </div>

      <nav>
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
      </nav>
    </aside>
  );
};

export default Sidebar;