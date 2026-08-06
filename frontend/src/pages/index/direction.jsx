import React from 'react';
import '../styles_admin/direction.css';
import { useLanguage } from '../../context/LanguageContext';

export default function Direction() {
  const { t, tDynamic } = useLanguage();

  const skills = [
    "Réseaux Cisco",
    "Sécurité Fortinet",
    "Cloud Azure",
    "Virtualisation",
    "Fibre Optique",
    "Télécoms",
    "Management",
    "Documentation"
  ];

  return (
    <section className="director-ultra-section" id="director">
      {/* Décoration d'arrière-plan */}
      <div className="director-bg-glow"></div>

      <div className="director-container">
        
        {/* COLONNE GAUCHE : LA CARTE DE PROFIL */}
        <div className="executive-card">
          <div className="executive-avatar-wrap">
            <div className="executive-hexagon">
              <span>N</span>
              <div className="hex-border-spin"></div>
            </div>
          </div>

          <h3 className="executive-name">NABINE Tassounti</h3>
          <p className="executive-title">{t("direction_dg_title")}</p>

          <div className="executive-contact-list">
            <a href="mailto:nabine@optinet.tg" className="contact-pill">
              <span className="icon">📧</span> nabine@optinet.tg
            </a>
            <a href="tel:+22890748465" className="contact-pill">
              <span className="icon">📞</span> +228 90 74 84 65
            </a>
            <div className="contact-pill">
              <span className="icon">🌐</span> LinkedIn: NABINE T.
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : PARCOURS & SKILLS */}
        <div className="executive-content">
          <div className="badge-modern">{t("direction_tag")}</div>
          <h2 className="executive-main-title">
            {t("direction_title_1")} <br />
            <span className="text-gradient">{t("direction_title_2")}</span>
          </h2>
          
          <p className="executive-bio">
            {t("direction_bio")}
          </p>

          <div className="skills-container">
            <h4 className="skills-title">{t("direction_skills_title")}</h4>
            <div className="skill-grid">
              {skills.map((s, i) => (
                <span key={i} className="skill-item">{tDynamic(s)}</span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}