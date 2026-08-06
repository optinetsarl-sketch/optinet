import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import servicesData from './servicesData';
import { useLanguage } from '../../context/LanguageContext';

export default function Services() {
  const navigate = useNavigate();
  const [activeService, setActiveService] = useState(null);
  const { t, tDynamic } = useLanguage();

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
        <div className="section-tag">{t("services_tag")}</div>
        <h2 className="section-title">
          {t("services_title_1")} <span className="accent">{t("services_title_2")}</span>
          <br />
          {t("services_title_3")}
        </h2>
        <p className="section-sub">
          {t("services_sub")}
        </p>
      </div>

      <div className="services-grid">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="service-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/services/${service.id}`)}
            onKeyDown={(e) => (e.key === 'Enter' ? navigate(`/services/${service.id}`) : null)}
          >
            {service.image ? (
              <div style={{ height: 170, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
                <img src={service.image} alt={service.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ) : (
              <div className="service-icon">{service.icon}</div>
            )}
            <div className="service-title">{tDynamic(service.title)}</div>
            <div className="service-desc">{tDynamic(service.desc)}</div>
            <div className="service-tags">
              {service.tags.map((tag) => (
                <span key={tag} className="service-tag">{tDynamic(tag)}</span>
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
              <h2>{tDynamic(activeService.title)}</h2>
            </div>

            <div className="modal-body">
              <p className="modal-full-desc">{tDynamic(activeService.fullDesc)}</p>

              <div className="modal-tags-section">
                <h4>{t("services_included")}</h4>
                <div className="service-tags">
                  {activeService.tags.map((tag) => (
                    <span key={tag} className="service-tag">{tDynamic(tag)}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button className="btn-primary modal-btn" onClick={() => setActiveService(null)}>
                {t("services_close")}
              </button>
              <button
                className="btn-outline"
                onClick={() => {
                  setActiveService(null);
                  navigate(`/services/${activeService.id}`);
                }}
              >
                {t("services_view_full")}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}