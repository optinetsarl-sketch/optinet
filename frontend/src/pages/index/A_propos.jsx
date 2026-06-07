import React from 'react';
import '../styles_admin/A_propos.css';

export default function APropos() {
  return (
    <section className="about-ultra" id="about">
      {/* Fond technologique discret */}
      <div className="tech-grid-overlay"></div>
      
      <div className="about-wrapper">
        
        {/* BLOC VISUEL GAUCHE (CARTE D'IDENTITÉ TECH) */}
        <div className="about-visual-card">
          <div className="card-glow"></div>
          
          <div className="card-inner">
            <div className="big-logo-hex">O</div>
            <h3 className="company-name">Opti<span>Net</span> SARL U</h3>
            <p className="company-subtitle">Solutions IT • Réseaux • Télécommunications</p>

            <div className="info-modern-grid">
              <div className="info-item">
                <small>SIÈGE SOCIAL</small>
                <span>Lomé, Togo</span>
              </div>
              <div className="info-item">
                <small>CRÉÉE</small>
                <span>2026</span>
              </div>
              <div className="info-item">
                <small>SECTEUR</small>
                <span>IT & Télécom</span>
              </div>
              <div className="info-item">
                <small>DOMAINE</small>
                <span>Services Techniques</span>
              </div>
            </div>

            <div className="about-stat-badge">
              <span className="stat-num">100+</span>
              <span className="stat-lbl">Projets réalisés</span>
            </div>
          </div>
        </div>

        {/* BLOC TEXTE DROITE (CONTENU NARRATIF) */}
        <div className="about-content-text">
          <div className="section-tag-modern">À PROPOS</div>
          <h2 className="section-title-ultra">
            Qui sommes-<br />
            <span className="accent-gradient">nous ?</span>
          </h2>
          
          <p className="section-description">
            <strong>OPTINET SARL U</strong> est une société togolaise de technologie,
            enregistrée et opérationnelle depuis 2026. Spécialisée dans les
            solutions IT, les réseaux et les télécommunications, elle
            intervient auprès d'institutions publiques et privées pour la
            modernisation de leurs infrastructures numériques.
          </p>

          <div className="features-stack">
            <div className="feat-card">
              <div className="feat-icon">⚡</div>
              <div className="feat-txt">
                <h4>Réactivité & Expertise</h4>
                <p>Une équipe hautement qualifiée avec certifications internationales et expérience opérationnelle.</p>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon">🎯</div>
              <div className="feat-txt">
                <h4>Solutions Sur Mesure</h4>
                <p>Adaptées à vos besoins spécifiques, scalables et pérennes.</p>
              </div>
            </div>

            <div className="feat-card">
              <div className="feat-icon">🛡️</div>
              <div className="feat-txt">
                <h4>Sécurité en Priorité</h4>
                <p>Conformité aux standards internationaux et protection maximale de vos données.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}