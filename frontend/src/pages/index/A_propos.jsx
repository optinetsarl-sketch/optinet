import React from 'react';
import '../styles_admin/A_propos.css';
import optinetLogo from "../../assets/optinet-logo.png";
import { useLanguage } from '../../context/LanguageContext';

export default function APropos() {
  const { t } = useLanguage();

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
            <div className="feat-card">
              <div className="feat-icon">⚡</div>
              <div className="feat-txt">
                <h4>{t("about_feat1_title")}</h4>
                <p>{t("about_feat1_desc")}</p>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon">🎯</div>
              <div className="feat-txt">
                <h4>{t("about_feat2_title")}</h4>
                <p>{t("about_feat2_desc")}</p>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon">🛡️</div>
              <div className="feat-txt">
                <h4>{t("about_feat3_title")}</h4>
                <p>{t("about_feat3_desc")}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}