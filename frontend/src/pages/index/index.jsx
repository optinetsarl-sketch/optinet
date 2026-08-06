import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroBg from "../../assets/360_F_521661218_MNYc5lCrIQUKKwBfIGzxJYHYxZzwNof9.jpg";
import { useLanguage } from "../../context/LanguageContext";

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

  const loop = annonces.length ? [...annonces, ...annonces] : [];

  return (
    <>
      <section className="hero-modern" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <div className="dot"></div>
              <span>{t("hero_location_badge")}</span>
            </div>

            <h1 className="hero-title">
              {t("hero_title_part1")} <br />
              <span className="accent-text">{t("hero_title_part2")}</span>
            </h1>

            <p className="hero-description">
              {t("hero_description")}
            </p>

            <div className="hero-features">
              <div className="feat"><span>✔</span> {t("hero_feat_networks")}</div>
              <div className="feat"><span>✔</span> {t("hero_feat_security")}</div>
              <div className="feat"><span>✔</span> {t("hero_feat_telecom")}</div>
              <div className="feat"><span>✔</span> {t("hero_feat_infra")}</div>
              <div className="feat"><span>✔</span> {t("hero_feat_software")}</div>
            </div>
            <br />
            <br />
            <div className="hero-btns">
              <Link to="/contact" className="btn-main">{t("hero_btn_launch")}</Link>
              <Link to="/services" className="btn-outline">{t("hero_btn_services")}</Link>
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
          <span style={{ color: "#12b3d6", fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>{t("announcements_badge")}</span>
          <h2 style={{ fontSize: 34, fontWeight: 800, margin: "8px 0" }}>{t("announcements_title")}</h2>
          <p style={{ color: "#9fb3c8" }}>{t("announcements_subtitle")}</p>
        </div>

        {loop.length === 0 ? (
          <p style={{ textAlign: "center", color: "#9fb3c8" }}>{t("announcements_empty")}</p>
        ) : (
          <div style={{ position: "relative" }}>
            <div className="optipub-marquee">
              {loop.map((a, i) => (
                <Link to={`/articles/${a.uuid}`} key={i} className="optipub-card">
                  <div style={{ position: "relative" }}>
                    <img src={httpsUrl(a.image_principale)} alt={a.nom} style={{ width: "100%", height: 175, objectFit: "cover", display: "block" }} />
                    {a.prix && (
                      <span style={{ position: "absolute", bottom: 8, left: 8, background: "#11b981", color: "#fff", fontWeight: 800, fontSize: 13, padding: "4px 10px", borderRadius: 16 }}>{a.prix}</span>
                    )}
                  </div>
                  <div style={{ padding: "12px 14px", fontWeight: 700, fontSize: 14, lineHeight: 1.3, minHeight: 44 }}>
                    {tDynamic(a.nom || "Article OPTINET").slice(0, 60)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link to="/galerie" className="btn-outline">{t("announcements_view_all")}</Link>
        </div>
      </section>

      {/* ── Le Journal : dernières actualités ── */}
      {actus.length > 0 && (
        <section style={{ background: "#050d1c", padding: "64px 20px", color: "#fff" }}>
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
    </>
  );
}

