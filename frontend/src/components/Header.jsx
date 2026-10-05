import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { useMessages } from "../context/MessageContext";
import { getMessages } from "../services/authService";

/* ── PAGE TITLES ── */
const PAGE_TITLES = {
  "/admin/dashboard":   "Vue d'ensemble",
  "/admin/users":       "Gestion des Utilisateurs",
  "/admin/message":     "Messagerie Client",
  "/admin/portfolio":   "Projets Portfolio",
  "/admin/galerie":     "Galerie Multimédia",
  "/admin/journal":     "Actualités & Journal",
  "/admin/carnetAdress":"Carnet d'Adresses",
  "/admin/settings":    "Paramètres Système",
};

const Header = () => {
  const { unreadCount } = useMessages();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropOpen, setDropOpen]   = useState(false);
  const [messages, setMessages]   = useState([]);
  const [loadingMsgs, setLoading] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  const bellRef    = useRef(null);
  const dropRef    = useRef(null);
  const userBtnRef = useRef(null);
  const userDropRef= useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] || "Administration";

  // Date actuelle en français
  const todayFormatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  /* ── Charger les messages non lus à l'ouverture du panel ── */
  const loadMessages = useCallback(() => {
    setLoading(true);
    getMessages()
      .then((r) => {
        const nonLus = (r.data || [])
          .filter((m) => m.statut === "non_lu")
          .slice(0, 8);
        setMessages(nonLus);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleDrop = () => {
    if (!dropOpen) loadMessages();
    setDropOpen((v) => !v);
    setUserDropOpen(false);
  };

  const toggleUserDrop = () => {
    setUserDropOpen((v) => !v);
    setDropOpen(false);
  };

  /* ── Fermer en cliquant dehors ── */
  useEffect(() => {
    const handler = (e) => {
      if (
        dropRef.current && !dropRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) setDropOpen(false);
      if (
        userDropRef.current && !userDropRef.current.contains(e.target) &&
        userBtnRef.current && !userBtnRef.current.contains(e.target)
      ) setUserDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Logout ── */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  /* ── Format date relative ── */
  const relativeTime = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return "à l'instant";
    if (mins  < 60) return `il y a ${mins} min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  };

  /* ── Initiales et Email de l'admin ── */
  const adminEmail = localStorage.getItem("admin_email") || "admin@optinet.com";
  const initials = adminEmail.slice(0, 2).toUpperCase();

  return (
    <header className="header" role="banner">
      <div className="header__inner">

        {/* ── Titre de page + Date ── */}
        <div className="header__left">
          <div className="header__title-row">
            <h1 className="header__title">{pageTitle}</h1>
            <span className="header__env-badge">Production</span>
          </div>
          <span className="header__date">{todayFormatted}</span>
        </div>

        <div className="header__actions">

          {/* ── Bouton Accès rapide Site Public ── */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="header__quick-btn"
            title="Ouvrir le site vitrine OPTINET"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span className="header__quick-btn-text">Site Web</span>
          </a>

          {/* ── Bouton Accès Paramètres ── */}
          <Link
            to="/admin/settings"
            className="header__icon-btn"
            title="Paramètres de l'application"
            aria-label="Paramètres"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </Link>

          {/* ── Cloche notifications ── */}
          <div className="header__notif-wrap">
            <button
              ref={bellRef}
              className={`header__icon-btn${dropOpen ? " header__icon-btn--active" : ""}`}
              aria-label={`Notifications — ${unreadCount} non lus`}
              aria-expanded={dropOpen}
              onClick={toggleDrop}
              id="notif-bell-btn"
            >
              <svg
                className={`header__bell-icon${unreadCount > 0 ? " header__bell-icon--ring" : ""}`}
                width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>

              {unreadCount > 0 && (
                <span className="header__badge header__badge--danger" aria-hidden="true">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* ── DROPDOWN PANEL ── */}
            {dropOpen && (
              <div ref={dropRef} className="header__notif-panel" role="dialog" aria-label="Notifications">

                {/* En-tête du panel */}
                <div className="notif-panel__head">
                  <div className="notif-panel__head-left">
                    <span className="notif-panel__title">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="notif-panel__count">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</span>
                    )}
                  </div>
                  <button
                    className="notif-panel__close"
                    onClick={() => setDropOpen(false)}
                    aria-label="Fermer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>

                {/* Liste */}
                <div className="notif-panel__list">
                  {loadingMsgs && (
                    <div className="notif-panel__empty">
                      <div className="notif-spinner" /><span>Chargement…</span>
                    </div>
                  )}

                  {!loadingMsgs && messages.length === 0 && (
                    <div className="notif-panel__empty">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                      </svg>
                      <span>Aucune nouvelle notification</span>
                    </div>
                  )}

                  {!loadingMsgs && messages.map((msg) => (
                    <Link
                      key={msg.id}
                      to="/admin/message"
                      className="notif-item"
                      onClick={() => setDropOpen(false)}
                    >
                      {/* Avatar initiales */}
                      <div className="notif-item__avatar">
                        {(msg.nom || "?").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="notif-item__body">
                        <div className="notif-item__row">
                          <span className="notif-item__name">{msg.nom || "Inconnu"}</span>
                          <span className="notif-item__time">{relativeTime(msg.date_creation)}</span>
                        </div>
                        <div className="notif-item__subject">{msg.sujet}</div>
                        <div className="notif-item__preview">
                          {(msg.contenu || "").slice(0, 80)}{msg.contenu?.length > 80 ? "…" : ""}
                        </div>
                      </div>
                      <div className="notif-item__dot" aria-label="Non lu" />
                    </Link>
                  ))}
                </div>

                {/* Pied */}
                <div className="notif-panel__footer">
                  <Link
                    to="/admin/message"
                    className="notif-panel__see-all"
                    onClick={() => setDropOpen(false)}
                  >
                    Voir tous les messages
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="header__divider" />

          {/* ── Utilisateur connecté ── */}
          <div className="header__user-wrap">
            <button
              ref={userBtnRef}
              className={`header__user-btn${userDropOpen ? " header__user-btn--active" : ""}`}
              aria-label="Menu utilisateur"
              aria-expanded={userDropOpen}
              onClick={toggleUserDrop}
            >
              <div className="header__avatar header__avatar--placeholder">{initials}</div>
              <div className="header__user-text">
                <span className="header__username">Admin</span>
                <span className="header__user-role">Super Admin</span>
              </div>
              <svg
                className={`header__chevron${userDropOpen ? " header__chevron--open" : ""}`}
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* User dropdown */}
            {userDropOpen && (
              <div ref={userDropRef} className="header__user-drop">
                <div className="user-drop__info">
                  <div className="user-drop__avatar">{initials}</div>
                  <div>
                    <div className="user-drop__name">Administrateur</div>
                    <div className="user-drop__email">{adminEmail}</div>
                  </div>
                </div>
                <div className="user-drop__divider" />
                <Link
                  to="/admin/settings"
                  className="user-drop__item"
                  onClick={() => setUserDropOpen(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Paramètres & Profil
                </Link>
                <div className="user-drop__divider" />
                <button className="user-drop__item user-drop__item--danger" onClick={handleLogout}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Se déconnecter
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
