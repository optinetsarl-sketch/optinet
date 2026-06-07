import React, { useEffect, useState } from 'react';
import { getPortfolios } from '../../services/authService';
import '../styles_admin/public_portfolio.css';

const PortfolioSection = () => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    // Fetch real data
    getPortfolios()
      .then((res) => {
        // Filter only active portfolios and sort by ordre_affichage
        const activePortfolios = res.data
          .filter(p => p.est_actif)
          .sort((a, b) => a.ordre_affichage - b.ordre_affichage);
        setPortfolios(activePortfolios);
      })
      .catch((err) => console.error("Erreur lors de la récupération du portfolio:", err));
  }, []);

  useEffect(() => {
    if (portfolios.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".pub-portfolio-card");
    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [portfolios]);

  if (portfolios.length === 0) return null;

  return (
    <section className="pub-portfolio-section" id="portfolio">
      <div className="pub-portfolio-header">
        <div className="section-tag">Nos Réalisations</div>
        <h2 className="section-title">
          Découvrez notre <span className="accent">Portfolio</span>
        </h2>
        <p className="section-sub">
          Explorez une sélection de nos meilleurs projets, démontrant notre expertise en conception et développement de solutions numériques innovantes.
        </p>
      </div>

      <div className="pub-portfolio-grid">
        {portfolios.map((item, index) => (
          <div className="pub-portfolio-card" key={item.id} style={{ transitionDelay: `${(index % 3) * 0.15}s` }}>
            <div className="pub-portfolio-img-wrapper">
              <img src={item.image_principale} alt={item.titre} className="pub-portfolio-img" />
              <div className="pub-portfolio-overlay">
                {item.lien_projet ? (
                  <a href={item.lien_projet} target="_blank" rel="noopener noreferrer" className="pub-portfolio-link">
                    Voir le projet
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                ) : (
                  <span className="pub-portfolio-link" style={{ pointerEvents: 'none' }}>
                    Projet Privé
                  </span>
                )}
              </div>
            </div>
            <div className="pub-portfolio-content">
              {item.categorie && (
                <div className="pub-portfolio-client">{item.categorie.nom}</div>
              )}
              <h3 className="pub-portfolio-title">{item.titre}</h3>
              <p className="pub-portfolio-desc">{item.description}</p>
              <div className="pub-portfolio-tags">
                {item.technologies.split(',').map((tech, i) => (
                  <span className="pub-portfolio-tag" key={i}>{tech.trim()}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
