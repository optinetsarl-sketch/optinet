import React, { useEffect, useState } from 'react';
import { getPortfolios } from '../../services/authService';
import '../styles_admin/public_portfolio.css';
import { useLanguage } from '../../context/LanguageContext';

const fallbackPortfolios = [
  {
    id: 'fallback-1',
    titre: 'Infrastructure réseau sur mesure',
    description: 'Conception et mise en place de réseaux sécurisés pour les entreprises et administrations avec optimisation de la performance et de la fiabilité.',
    image_principale: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    categorie: { nom: 'Réseaux & Infrastructure' },
    technologies: 'Cisco, Fortinet, VLAN, Wi‑Fi Enterprise',
    lien_projet: null,
    est_actif: true,
    ordre_affichage: 1,
  },
  {
    id: 'fallback-2',
    titre: 'Sécurité vidéo & surveillance',
    description: 'Installation de systèmes de vidéosurveillance intelligents pour améliorer la sécurité des sites, bureaux, entrepôts et espaces publics.',
    image_principale: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80',
    categorie: { nom: 'Sécurité' },
    technologies: 'CCTV, Hikvision, Axis, Alarme',
    lien_projet: null,
    est_actif: true,
    ordre_affichage: 2,
  },
  {
    id: 'fallback-3',
    titre: 'Téléphonie IP & communication',
    description: 'Mise en place de solutions de téléphonie IP modernes pour fluidifier les échanges internes et externes des organisations.',
    image_principale: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    categorie: { nom: 'Télécommunications' },
    technologies: 'VoIP, Asterisk, PBX, SIP Trunking',
    lien_projet: null,
    est_actif: true,
    ordre_affichage: 3,
  },
];

const PortfolioSection = () => {
  const [portfolios, setPortfolios] = useState([]);
  const { t, tDynamic } = useLanguage();

  useEffect(() => {
    getPortfolios()
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : [];
        const activePortfolios = data
          .filter((p) => p?.est_actif)
          .sort((a, b) => (a.ordre_affichage ?? 0) - (b.ordre_affichage ?? 0));

        setPortfolios(activePortfolios.length ? activePortfolios : fallbackPortfolios);
      })
      .catch(() => setPortfolios(fallbackPortfolios));
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
        <div className="section-tag">{t("portfolio_tag")}</div>
        <h2 className="section-title">
          {t("portfolio_title_1")} <span className="accent">{t("portfolio_title_2")}</span>
        </h2>
        <p className="section-sub">
          {t("portfolio_sub")}
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
                    {t("portfolio_view_project")}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 6 }}>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                ) : (
                  <span className="pub-portfolio-link" style={{ pointerEvents: 'none' }}>
                    {t("portfolio_private")}
                  </span>
                )}
              </div>
            </div>
            <div className="pub-portfolio-content">
              {item.categorie && (
                <div className="pub-portfolio-client">{tDynamic(item.categorie.nom || item.categorie)}</div>
              )}
              <h3 className="pub-portfolio-title">{tDynamic(item.titre)}</h3>
              <p className="pub-portfolio-desc">{tDynamic(item.description)}</p>
              <div className="pub-portfolio-tags">
                {(typeof item.technologies === 'string' ? item.technologies.split(',') : []).map((tech, i) => (
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
