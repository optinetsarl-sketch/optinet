import { NavLink } from "react-router-dom";
import logo from "../assets/logo-Optinet-sokode.webp";
import "./Sidebar.css";
import { useMessages } from "../context/MessageContext";

const NAV_ITEMS = [
  {
    to: "/admin/dashboard", label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: "/admin/users", label: "Utilisateurs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    to: "/admin/message", label: "Messages", badge: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    to: "/admin/portfolio", label: "Portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    to: "/admin/galerie", label: "Galerie",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    ),
  },
  {
    to: "/admin/journal", label: "Journal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
  },
  {
    to: "/admin/carnetAdress", label: "Carnet d'Adresses",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="23" y1="11" x2="23" y2="11"/><line x1="19" y1="11" x2="19" y2="11"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      </svg>
    ),
  },
  {
    to: "/admin/settings", label: "Paramètres",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { unreadCount } = useMessages();
  const adminEmail = localStorage.getItem("admin_email") || "admin@optinet.com";
  const initials = adminEmail.slice(0, 2).toUpperCase();

  return (
    <aside className="sidebar" role="navigation" aria-label="Navigation principale">

      {/* ── Brand ── */}
      <div className="sidebar__brand">
        <img src={logo} alt="Logo OPTINET" className="sidebar__logo-img" />
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">OPTINET</span>
          <span className="sidebar__brand-sub">Administration</span>
        </div>
      </div>

      {/* ── Navigation principale ── */}
      <p className="sidebar__section-label">Menu Principal</p>
      <ul className="sidebar__nav">
        {NAV_ITEMS.map(({ to, label, icon, badge }) => (
          <li key={to} className="sidebar__nav-item">
            <NavLink
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) =>
                `sidebar__link${isActive ? " sidebar__link--active" : ""}`
              }
            >
              <span className="sidebar__link-icon">{icon}</span>
              <span className="sidebar__link-label">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="sidebar__link-badge" title={`${unreadCount} non lus`}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* ── Séparateur ── */}
      <div className="sidebar__divider" />

      {/* ── Liens rapides / applications ── */}
      <p className="sidebar__section-label">Raccourcis & Accès</p>
      <div className="sidebar__quick-actions">
        {/* Lien site public */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="sidebar__public-site-btn"
          title="Ouvrir le site vitrine dans un nouvel onglet"
        >
          <div className="sidebar__public-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span className="sidebar__public-text">Voir le site public</span>
          <svg className="sidebar__public-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>

        {/* Bouton OPTIPUB */}
        <div className="sidebar__optipub-section">
          <a
            href="http://localhost:5000"
            className="sidebar__optipub-btn"
            title="Ouvrir l'administration OPTIPUB"
          >
            <div className="sidebar__optipub-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
              </svg>
            </div>
            <div className="sidebar__optipub-text">
              <span className="sidebar__optipub-name">OPTIPUB</span>
              <span className="sidebar__optipub-sub">Gestion publicité</span>
            </div>
            <span className="sidebar__optipub-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* ── Footer utilisateur connecté ── */}
      <div className="sidebar__user-card">
        <div className="sidebar__user-avatar">{initials}</div>
        <div className="sidebar__user-details">
          <div className="sidebar__user-name">Administrateur</div>
          <div className="sidebar__user-status">
            <span className="sidebar__status-dot" />
            <span>En ligne</span>
          </div>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;