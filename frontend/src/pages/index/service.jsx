import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import servicesData from './servicesData';
// import './Services.css';

export default function Services() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setActiveService(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="services-section" id="services">
      <div className="services-header">
        <div className="section-tag">Nos Services</div>
        <h2 className="section-title">
          Des <span className="accent">Solutions Complètes</span>
          <br />
          pour Votre Organisation
        </h2>
        <p className="section-sub">
          OPTINET SARL U propose une gamme complète de services IT et télécom
          adaptés aux besoins des institutions publiques et entreprises privées.
        </p>
      </div>

      <div className="services-grid">
        {/* 3. On boucle sur les données pour afficher les cartes */}
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="service-card"
            role="button"
            tabIndex={0}
            onClick={() => setActiveService(service)}
            onKeyDown={(e) => (e.key === 'Enter' ? setActiveService(service) : null)}
          >
            <div className="service-icon">{service.icon}</div>
            <div className="service-title">{service.title}</div>
            <div className="service-desc">{service.desc}</div>
            <div className="service-tags">
              {service.tags.map((tag) => (
                <span key={tag} className="service-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODALE : s'affiche au-dessus de la page principale */}
      {activeService && (
        <div className="service-modal-overlay" onClick={() => setActiveService(null)}>
          <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveService(null)}>&times;</button>

            <div className="modal-header">
              <span className="modal-icon">{activeService.icon}</span>
              <h2>{activeService.title}</h2>
            </div>

            <div className="modal-body">
              <p className="modal-full-desc">{activeService.fullDesc}</p>

              <div className="modal-tags-section">
                <h4>Expertises incluses :</h4>
                <div className="service-tags">
                  {activeService.tags.map((tag) => (
                    <span key={tag} className="service-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button className="btn-primary modal-btn" onClick={() => setActiveService(null)}>
                Fermer
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  setActiveService(null);
                  navigate(`/services/${activeService.id}`);
                }}
              >
                Voir la page complète
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}