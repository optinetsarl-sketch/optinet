import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// IMPORT DE TON IMAGE LOCALE
import heroBg from "../../assets/360_F_521661218_MNYc5lCrIQUKKwBfIGzxJYHYxZzwNof9.jpg";

const API_URL = import.meta.env.VITE_API_URL || "";
// Force https pour éviter le blocage "contenu mixte" sur les images
const httpsUrl = (u) => {
  if (!u) return "";
  // En local le serveur Django est http ; on ne force https que pour les domaines en ligne
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, "https://");
};

export default function Homes() {
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/photos/`)
      .then((r) => r.json())
      .then((data) =>
        setAnnonces((data || []).filter((p) => p.est_actif).slice(0, 12))
      )
      .catch(() => {});
  }, []);

  // Doublé pour un défilement en boucle continue
  const loop = annonces.length ? [...annonces, ...annonces] : [];

  return (
    <>
      <section className="hero-modern" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <div className="dot"></div>
              <span>🇹🇬 Lomé, Togo • Solutions IT , Télécom & WEB </span>
            </div>

            <h1 className="hero-title">
              L'Expertise  <br />
              <span className="accent-text">au Service de Votre Croissance</span>
            </h1>

            <p className="hero-description">
              <strong>OPTINET SARL U</strong> est votre partenaire technologique de confiance au Togo.
              Réseaux, sécurité, télécommunications et infrastructures numériques —
              nous connectons votre organisation au futur.
            </p>

            <div className="hero-features">
              <div className="feat"><span>✔</span> Réseaux & Serveurs</div>
              <div className="feat"><span>✔</span> Sécurité informatique </div>
              <div className="feat"><span>✔</span> Télécommunications</div>
              <div className="feat"><span>✔</span> Infrastructures Numériques</div>
              <div className="feat"><span>✔</span> Logiciels </div>
            </div>
            <br />
            <br />
            <div className="hero-btns">
              <Link to="/contact" className="btn-main">Lancer Un Projet Avec Nous</Link>
              <Link to="/services" className="btn-outline">Nos services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bande publicitaire défilante : Nos articles ── */}
      <section style={{ background: "#020b18", padding: "56px 0", color: "#fff", overflow: "hidden" }}>
        <style>{`
          @keyframes optipubScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .optipub-marquee { display: flex; gap: 18px; width: max-content; animation: optipubScroll 45s linear infinite; padding: 0 9px; }
          .optipub-marquee:hover { animation-play-state: paused; }
          .optipub-card { width: 250px; flex: 0 0 auto; background: #0a1526; border: 1px solid #12233a; border-radius: 14px; overflow: hidden; text-decoration: none; color: #fff; }
        `}</style>

        <div style={{ textAlign: "center", marginBottom: 30, padding: "0 20px" }}>
          <span style={{ color: "#12b3d6", fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>NOS ANNONCES</span>
          <h2 style={{ fontSize: 34, fontWeight: 800, margin: "8px 0" }}>Nos produits en stock 🔥</h2>
          <p style={{ color: "#9fb3c8" }}>Ordinateurs, matériel et bonnes affaires — cliquez pour commander.</p>
        </div>

        {loop.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9fb3c8" }}>Bientôt de nouvelles annonces…</p>
        ) : (
          <div style={{ position: "relative" }}>
            <div className="optipub-marquee">
              {loop.map((a, i) => (
                <Link to="/galerie" key={i} className="optipub-card">
                  <div style={{ position: "relative" }}>
                    <img src={httpsUrl(a.image_principale)} alt={a.titre} style={{ width: "100%", height: 175, objectFit: "cover", display: "block" }} />
                    {a.prix && (
                      <span style={{ position: "absolute", bottom: 8, left: 8, background: "#11b981", color: "#fff", fontWeight: 800, fontSize: 13, padding: "4px 10px", borderRadius: 16 }}>{a.prix}</span>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px", fontWeight: 700, fontSize: 14, lineHeight: 1.3, minHeight: 44 }}>
                    {(a.titre || "Article OPTINET").slice(0, 60)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link to="/galerie" className="btn-outline">Voir tous les articles</Link>
        </div>
      </section>
    </>
  );
}
