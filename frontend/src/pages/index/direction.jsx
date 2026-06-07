import React from 'react';
import '../styles_admin/direction.css';

export default function Direction() {
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
          <p className="executive-title">Directeur Général – OPTINET SARL U</p>

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
          <div className="badge-modern">L'EXPERTISE AU SOMMET</div>
          <h2 className="executive-main-title">
            Une Vision, <br />
            <span className="text-gradient">une Expertise</span>
          </h2>
          
          <p className="executive-bio">
            <strong>M. NABINE Tassounti</strong> est un ingénieur réseaux et
            télécommunications avec plus de <strong>5 ans d'expérience</strong> sur le terrain.
            Il a conçu et déployé des infrastructures pour certaines des
            institutions les plus stratégiques du Togo, avec des
            certifications internationales de haut niveau.
          </p>

          <div className="skills-container">
            <h4 className="skills-title">Compétences Clés</h4>
            <div className="skill-grid">
              <span className="skill-item">Réseaux Cisco</span>
              <span className="skill-item">Sécurité Fortinet</span>
              <span className="skill-item">Cloud Azure</span>
              <span className="skill-item">Virtualisation</span>
              <span className="skill-item">Fibre Optique</span>
              <span className="skill-item">Télécoms</span>
              <span className="skill-item">Management</span>
              <span className="skill-item">Documentation</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}