import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "../../assets/services/service-1.jpg";
import { useLanguage } from "../../context/LanguageContext";
import "./home.css";

const API_URL = import.meta.env.VITE_API_URL || "";
const httpsUrl = (u) => {
  if (!u) return "";
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, "https://");
};

const CAT_COLOR = { intervention: "#12b3d6", realisation: "#11b981", actualite: "#6c6cf0", annonce: "#f0a531" };
const formatDate = (iso, lang = 'fr') => { try { const localeMap = { fr: 'fr-FR', en: 'en-US', zh: 'zh-CN' }; return new Date(iso).toLocaleDateString(localeMap[lang] || 'fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return ''; } };

export default function Homes() {
  const [annonces, setAnnonces] = useState([]);
  const [actus, setActus] = useState([]);
  const { t, tDynamic, language } = useLanguage();

  useEffect(() => {
    fetch(`${API_URL}/api/produits/`)
      .then((r) => r.json())
      .then((data) =>
        setAnnonces((data || []).filter((p) => p.est_actif).slice(0, 12))
      )
      .catch(() => {});
    fetch(`${API_URL}/api/actualites/`)
      .then((r) => r.json())
      .then((data) =>
        setActus((data || []).filter((a) => a.est_publie).slice(0, 3))
      )
      .catch(() => {});
  }, []);

  return (
    <div className="home-page">
      <section className="hero-modern" style={{ backgroundImage: `url(${heroBg})` }} aria-labelledby="home-hero-title">
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <div className="dot"></div>
              <span>{t("hero_location_badge")}</span>
            </div>

            <h1 id="home-hero-title" className="hero-title">
              {t("hero_title_part1")}
              <span className="accent-text">{t("hero_title_part2")}</span>
            </h1>

            <p className="hero-description">
              {t("hero_description")}
            </p>

            <ul className="hero-features" aria-label={t("services")}>
              <li className="feat"><span aria-hidden="true">✓</span> {t("hero_feat_networks")}</li>
              <li className="feat"><span aria-hidden="true">✓</span> {t("hero_feat_security")}</li>
              <li className="feat"><span aria-hidden="true">✓</span> {t("hero_feat_telecom")}</li>
              <li className="feat"><span aria-hidden="true">✓</span> {t("hero_feat_infra")}</li>
              <li className="feat"><span aria-hidden="true">✓</span> {t("hero_feat_software")}</li>
            </ul>

            <div className="hero-btns">
              <Link to="/contact" className="btn-main">{t("hero_btn_launch")}</Link>
              <Link to="/services" className="btn-outline">{t("hero_btn_services")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bande publicitaire défilante : Nos articles ── */}
      <section className="home-products" aria-labelledby="home-products-title">
        <div className="home-products__heading">
          <span className="home-products__eyebrow">{t("announcements_badge")}</span>
          <h2 id="home-products-title">{t("announcements_title")}</h2>
          <p>{t("announcements_subtitle")}</p>
        </div>

        {annonces.length === 0 ? (
          <p className="home-products__empty">{t("announcements_empty")}</p>
        ) : (
          <div className="home-product-grid">
            {annonces.map((a) => (
                <Link to={`/articles/${a.uuid}`} key={a.uuid} className="home-product-card">
                  <div className="home-product-card__image">
                    {a.image_principale && (
                      <img src={httpsUrl(a.image_principale)} alt={tDynamic(a.nom || "Article OPTINET")} loading="lazy" />
                    )}
                    {a.prix && <span className="home-product-card__price">{a.prix}</span>}
                  </div>
                  <div className="home-product-card__name">
                    {tDynamic(a.nom || "Article OPTINET").slice(0, 60)}
                  </div>
                </Link>
            ))}
          </div>
        )}

        <div className="home-products__actions">
          <Link to="/galerie" className="home-products__all">{t("announcements_view_all")}</Link>
        </div>
      </section>

      {/* ── Le Journal : dernières actualités ── */}
      {actus.length > 0 && (
        <section className="home-journal" style={{ background: "#050d1c", padding: "64px 20px", color: "#fff" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 34 }}>
              <span style={{ color: "#12b3d6", fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>{t("journal_badge")}</span>
              <h2 style={{ fontSize: 34, fontWeight: 800, margin: "8px 0" }}>{t("journal_title")}</h2>
              <p style={{ color: "#9fb3c8" }}>{t("journal_subtitle")}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
              {actus.map((a) => (
                <Link key={a.id} to={`/journal/${a.id}`}
                  style={{ background: "#0a1526", borderRadius: 16, overflow: "hidden", border: "1px solid #12233a", display: "flex", flexDirection: "column", textDecoration: "none", color: "#fff" }}>
                  <div style={{ position: "relative", height: 180, background: "#07101f" }}>
                    {a.image_principale && (
                      <img src={httpsUrl(a.image_principale)} alt={a.titre} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    )}
                    <span style={{ position: "absolute", top: 10, left: 10, background: CAT_COLOR[a.categorie] || "#12b3d6", color: "#03121f", fontWeight: 800, fontSize: 11, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase" }}>
                      {t(`cat_${a.categorie}`) || a.categorie_label}
                    </span>
                    {a.a_video && <span style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,.7)", fontSize: 12, padding: "3px 9px", borderRadius: 20 }}>🎬</span>}
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11.5, color: "#63798f" }}>{formatDate(a.date_publication, language)}</span>
                    <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.3 }}>{tDynamic(a.titre)}</div>
                    {a.extrait && <div style={{ color: "#9fb3c8", fontSize: 13, lineHeight: 1.5 }}>{tDynamic(a.extrait)}</div>}
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: 32 }}>
              <Link to="/journal" className="btn-outline">{t("journal_view_all")}</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

