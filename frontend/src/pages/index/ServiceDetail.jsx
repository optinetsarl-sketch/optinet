import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import servicesData from './servicesData';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const serviceId = parseInt(id, 10);
  const service = servicesData.find((s) => s.id === serviceId);

  if (!service) {
    return (
      <section style={{ padding: '100px 6%' }}>
        <h2>Service non trouvé</h2>
        <p>Le service demandé n'existe pas.</p>
        <button className="btn-outline" onClick={() => navigate(-1)}>Retour</button>
      </section>
    );
  }

  return (
    <section className="services-section" style={{ padding: '80px 6%' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
          ← Retour
        </button>

        <div className="service-card" style={{ padding: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
            <div className="service-icon" style={{ width: 72, height: 72, fontSize: 36 }}>{service.icon}</div>
            <h1 style={{ margin: 0 }}>{service.title}</h1>
          </div>

          <p className="modal-full-desc" style={{ marginBottom: 18 }}>{service.fullDesc}</p>

          <div className="service-tags">
            {service.tags.map((tag) => (
              <span key={tag} className="service-tag" style={{ marginRight: 8 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
