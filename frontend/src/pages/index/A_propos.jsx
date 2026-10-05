import optinetLogo from "../../assets/optinet-logo.png";
import { useLanguage } from '../../context/LanguageContext';
import '../styles_admin/A_propos.css';

export default function APropos() {
  const { t } = useLanguage();
  const features = [
    { title: t("about_feat1_title"), description: t("about_feat1_desc") },
    { title: t("about_feat2_title"), description: t("about_feat2_desc") },
    { title: t("about_feat3_title"), description: t("about_feat3_desc") },
  ];

  return (
    <section className="about-ultra" id="about">
      {/* Fond technologique discret */}
      <div className="tech-grid-overlay"></div>
      
      <div className="about-wrapper">
        
        {/* BLOC VISUEL GAUCHE (CARTE D'IDENTITÉ TECH) */}
        <div className="about-visual-card">
          <div className="card-glow"></div>
          
          <div className="card-inner">
            <div className="big-logo-hex" style={{ overflow: "hidden", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={optinetLogo} alt="OptiNet" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <h3 className="company-name">Opti<span>Net</span> SARL U</h3>
            <p className="company-subtitle">Solutions IT • Réseaux • Télécommunications</p>

            <div className="info-modern-grid">
              <div className="info-item">
                <small>{t("about_hq")}</small>
                <span>Lomé, Togo</span>
              </div>
              <div className="info-item">
                <small>{t("about_created")}</small>
                <span>2026</span>
              </div>
              <div className="info-item">
                <small>{t("about_sector")}</small>
                <span>IT & Télécom</span>
              </div>
              <div className="info-item">
                <small>{t("about_domain")}</small>
                <span>Services Techniques</span>
              </div>
            </div>

            <div className="about-stat-badge">
              <span className="stat-num">100+</span>
              <span className="stat-lbl">{t("about_projects_count")}</span>
            </div>
          </div>
        </div>

        {/* BLOC TEXTE DROITE (CONTENU NARRATIF) */}
        <div className="about-content-text">
          <div className="section-tag-modern">{t("about_tag")}</div>
          <h2 className="section-title-ultra">
            {t("about_title_1")}<br />
            <span className="accent-gradient">{t("about_title_2")}</span>
          </h2>
          
          <p className="section-description">
            {t("about_desc")}
          </p>

          <div className="features-stack">
            {features.map((feature, index) => (
              <div className="feat-card" key={feature.title}>
                <span className="feat-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="feat-txt">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <a className="about-contact-link" href="mailto:optinetsarl@gmail.com">
            {t("contact")} <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}