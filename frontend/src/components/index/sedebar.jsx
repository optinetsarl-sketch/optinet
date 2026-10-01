import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import optinetLogo from "../../assets/optinet-logo.png";
import { useLanguage } from "../../context/LanguageContext";
import { cartCount } from "../../services/cart";
import LanguageSelector from "../LanguageSelector";
import "./sedebar.css";

function CartLink({ onClick }) {
  const [count, setCount] = useState(cartCount());
  const location = useLocation();
  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("cart-updated", update); window.removeEventListener("storage", update); };
  }, [location]);
  return (
    <Link to="/panier" onClick={onClick} aria-label="Panier"
      style={{ position: "relative", display: "inline-flex", alignItems: "center", color: "#fff", textDecoration: "none", fontSize: 22, padding: "4px 6px" }}>
      🛒
      {count > 0 && (
        <span style={{ position: "absolute", top: -4, right: -6, background: "#11b981", color: "#fff", fontSize: 11, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 10, display: "grid", placeItems: "center", padding: "0 4px" }}>
          {count}
        </span>
      )}
    </Link>
  );
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: "/", label: t("home") },
    {
      to: "/services",
      label: t("services"),
      children: [{ to: "/journal", label: t("journal") }],
    },
    {
      to: "/about",
      label: t("about"),
      children: [
        { to: "/direction", label: t("direction") },
        { to: "/certifications", label: t("certifications") },
        { to: "/contact", label: t("contact") },
        { to: "/portfolios", label: t("portfolio") },
      ],
    },
    { to: "/galerie", label: t("articles") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById("navbar");
      if (nav) {
        nav.style.background =
          window.scrollY > 60 ? "rgba(2,11,24,0.97)" : "rgba(2,11,24,0.85)";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenMobileGroup(null);
  };

  return (
    <nav id="navbar">
      {/* Logo */}
      <Link className="nav-logo" to="/" onClick={closeMenu}>
        <div className="nav-logo-circle" style={{ overflow: "hidden", padding: 0 }}>
          <img src={optinetLogo} alt="OptiNet" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
        </div>
        <span className="nav-logo-text">
          Opti<span>Net</span>
        </span>
      </Link>

      {/* Liens — desktop uniquement */}
      <ul className="nav-desktop-links">
        {NAV_ITEMS.map(({ to, label, children }) => (
          <li key={to} className={children ? "nav-dropdown" : undefined}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
              {children && <span className="nav-chevron" aria-hidden="true" />}
            </NavLink>
            {children && (
              <ul className="nav-submenu">
                {children.map((child) => (
                  <li key={child.to}>
                    <NavLink
                      to={child.to}
                      className={({ isActive }) => (isActive ? "active" : "")}
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* Panier + Sélecteur de Langue + CTA — desktop */}
      <div className="nav-cta-desktop" style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <LanguageSelector />
        <CartLink onClick={closeMenu} />
        <Link
          to="/contact"
          className="nav-cta"
          style={{ textDecoration: "none" }}
          onClick={closeMenu}
        >
          {t("quote_request")}
        </Link>
      </div>

      {/* Panier — visible sur mobile à côté du hamburger */}
      <div className="nav-cart-mobile" style={{ display: "none" }}>
        <CartLink onClick={closeMenu} />
      </div>

      {/* Bouton hamburger — mobile uniquement */}
      <button
        className={`nav-hamburger${menuOpen ? " nav-hamburger--open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Ouvrir le menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu déroulant — mobile uniquement */}
      {menuOpen && (
        <ul className="nav-mobile-menu">
          <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <LanguageSelector isMobile={true} />
          </li>
          {NAV_ITEMS.map(({ to, label, children }) => {
            const isOpen = openMobileGroup === to;
            const submenuId = `nav-mobile-submenu-${to.slice(1)}`;

            return (
              <li key={to} className={children ? "nav-mobile-group" : undefined}>
                {children ? (
                  <>
                    <div className="nav-mobile-group__row">
                      <NavLink
                        to={to}
                        className={({ isActive }) => (isActive ? "active" : "")}
                        onClick={closeMenu}
                      >
                        {label}
                      </NavLink>
                      <button
                        type="button"
                        className="nav-mobile-group__toggle"
                        aria-label={`${isOpen ? "Masquer" : "Afficher"} les liens de ${label}`}
                        aria-expanded={isOpen}
                        aria-controls={submenuId}
                        onClick={() => setOpenMobileGroup(isOpen ? null : to)}
                      >
                        <span
                          className={`nav-chevron${isOpen ? " nav-chevron--open" : ""}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    {isOpen && (
                      <ul id={submenuId} className="nav-mobile-submenu">
                        {children.map((child) => (
                          <li key={child.to}>
                            <NavLink
                              to={child.to}
                              className={({ isActive }) => (isActive ? "active" : "")}
                              onClick={closeMenu}
                            >
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={closeMenu}
                  >
                    {label}
                  </NavLink>
                )}
              </li>
            );
          })}
          <li className="nav-cta-mobile">
            <Link to="/contact" className="nav-cta" onClick={closeMenu}>
              {t("quote_request")}
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
