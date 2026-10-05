import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getPortfolios } from '../../services/authService';
import '../styles_admin/public_portfolio.css';

const PLACEHOLDER_TEXT = /^(?:test|thoma|r{3,}|d{3,})$/i;

const isPublishablePortfolio = (item) => {
  if (!item.est_actif || !item.image_principale || !item.titre?.trim()) return false;
  return ![item.titre, item.description, item.technologies]
    .some((value) => PLACEHOLDER_TEXT.test((value || '').trim()));
};

const PortfolioSection = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { t, tDynamic } = useLanguage();

  useEffect(() => {
    getPortfolios()
      .then((res) => {
        const activePortfolios = (Array.isArray(res.data) ? res.data : [])
          .filter(isPublishablePortfolio)
          .sort((a, b) => a.ordre_affichage - b.ordre_affichage);
        setPortfolios(activePortfolios);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du portfolio:", err);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
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

      {loading ? (
        <p className="pub-portfolio-status" role="status">{t("portfolio_loading")}</p>
      ) : portfolios.length === 0 ? (
        <div className="pub-portfolio-empty" role="status">
          <h3>{t(loadError ? "portfolio_error_title" : "portfolio_empty_title")}</h3>
          <p>{t(loadError ? "portfolio_error_sub" : "portfolio_empty_sub")}</p>
          <Link className="pub-portfolio-empty-link" to="/contact">
            {t("portfolio_empty_cta")}
          </Link>
        </div>
      ) : (
      <div className="pub-portfolio-grid">
        {portfolios.map((item, index) => (
          <article className="pub-portfolio-card" key={item.id} style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
            <div className="pub-portfolio-img-wrapper">
              <img src={item.image_principale} alt={tDynamic(item.titre)} className="pub-portfolio-img" loading="lazy" decoding="async" />
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
                <div className="pub-portfolio-client">{tDynamic(item.categorie.nom)}</div>
              )}
              <h3 className="pub-portfolio-title">{tDynamic(item.titre)}</h3>
              <p className="pub-portfolio-desc">{tDynamic(item.description)}</p>
              <div className="pub-portfolio-tags">
                {(item.technologies || '').split(',').map((tech) => tech.trim()).filter(Boolean).map((tech) => (
                  <span className="pub-portfolio-tag" key={tech}>{tech}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      )}
    </section>
  );
};

export default PortfolioSection;
