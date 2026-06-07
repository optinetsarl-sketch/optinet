import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">
              <div className="footer-logo-circle">O</div>
              <span className="footer-logo-text">
                Opti<span>Net</span>
              </span>
            </div>
            <p className="footer-desc">
              Solutions informatiques, réseaux et télécommunications au service
              des institutions publiques et entreprises privées en Afrique de
              l'Ouest.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">CCNA 200-301</span>
              <span className="footer-badge">NSE 4</span>
              <span className="footer-badge">AZ-500</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/about">À Propos</Link>
              </li>
              <li>
                <Link to="/certifications">Certifications</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>
                <Link to="/services">Réseaux IT</Link>
              </li>
              <li>
                <Link to="/services">Sécurité</Link>
              </li>
              <li>
                <Link to="/services">Télécoms</Link>
              </li>
              <li>
                <Link to="/services">Support</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Légal</h4>
            <ul>
              <li>
                <a href="#">Confidentialité</a>
              </li>
              <li>
                <a href="#">Conditions</a>
              </li>
              <li>
                <a href="#">RCCM: TG-LOM-2026-B12345</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 <strong>OPTINET SARL U</strong>. Tous droits réservés.
          </p>
          <div className="footer-legal">
            <span>Politique de confidentialité</span>
            <span>Conditions d'utilisation</span>
            <span>RCCM: TG-LOM-2026-B12345</span>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a
        className="whatsapp-float"
        href="https://wa.me/22890748465"
        target="_blank"
        rel="noreferrer"
        title="Discuter sur WhatsApp"
      >
        💬
      </a>
    </>
  );
}
