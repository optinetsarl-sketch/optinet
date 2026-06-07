import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./sedebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "À propos" },
  { to: "/direction", label: "Direction" },
  { to: "/certifications", label: "Certifications" },
  { to: "/portfolios", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
  { to: "/galerie", label: "Galerie" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <div className="nav-logo-circle">O</div>
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

      {/* CTA — desktop uniquement */}
      <Link
        to="/contact"
        className="nav-cta nav-cta-desktop"
        style={{ textDecoration: "none" }}
        onClick={closeMenu}
      >
        Demander un devis
      </Link>

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
              Demander un devis
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;