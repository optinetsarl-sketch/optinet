import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./sedebar.css";
import optinetLogo from "../../assets/optinet-logo.png";
import { cartCount } from "../../services/cart";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSelector from "../LanguageSelector";

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
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { to: "/", label: t("home") },
    { to: "/services", label: t("services") },
    { to: "/journal", label: t("journal") },
    { to: "/about", label: t("about") },
    { to: "/direction", label: t("direction") },
    { to: "/certifications", label: t("certifications") },
    { to: "/portfolios", label: t("portfolio") },
    { to: "/contact", label: t("contact") },
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

  const closeMenu = () => setMenuOpen(false);

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
        {NAV_ITEMS.map(({ to, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
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
          {NAV_ITEMS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}
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