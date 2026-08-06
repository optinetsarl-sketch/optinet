import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import servicesData from './servicesData';
import { getActualitesByService } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};
const formatDate = (iso, lang = 'fr') => {
  if (!iso) return '';
  try {
    const localeMap = { fr: 'fr-FR', en: 'en-US', zh: 'zh-CN' };
    return new Date(iso).toLocaleDateString(localeMap[lang] || 'fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return ''; }
};

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const serviceId = parseInt(id, 10);
  const service = servicesData.find((s) => s.id === serviceId);

  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, tDynamic, language } = useLanguage();

  useEffect(() => {
    if (!service?.slug) { setLoading(false); return; }
    setLoading(true);
    getActualitesByService(service.slug)
      .then((res) => setPubs((res.data || []).filter((a) => a.est_publie)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [service?.slug]);

  if (!service) {
    return (
      <section style={{ padding: '100px 6%' }}>
        <h2>Service non trouvé</h2>
        <p>Le service demandé n'existe pas.</p>
        <button className="btn-outline" onClick={() => navigate(-1)}>←</button>
      </section>
    );
  }

  return (
    <section className="services-section" style={{ padding: '80px 6%' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
          ← {t("services")}
        </button>

        <div className="service-card" style={{ padding: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
            <div className="service-icon" style={{ width: 72, height: 72, fontSize: 36 }}>{service.icon}</div>
            <h1 style={{ margin: 0 }}>{tDynamic(service.title)}</h1>
          </div>

          <p className="modal-full-desc" style={{ marginBottom: 18 }}>{tDynamic(service.fullDesc)}</p>

          <div className="service-tags">
            {service.tags.map((tag) => (
              <span key={tag} className="service-tag" style={{ marginRight: 8 }}>{tDynamic(tag)}</span>
            ))}
          </div>
        </div>

        {/* ── Publications liées à ce service ── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>📡 {language === 'en' ? `Our Projects in ${tDynamic(service.title)}` : language === 'zh' ? `${tDynamic(service.title)} 相关的最新施工案例` : `Nos réalisations en ${service.title}`}</h2>
          </div>

          {loading ? (
            <p style={{ color: '#9fb3c8' }}>Chargement…</p>
          ) : pubs.length === 0 ? (
            <p style={{ color: '#9fb3c8' }}>
              {language === 'en' ? 'No news for this service yet. Check our ' : language === 'zh' ? '该服务项目暂无更多施工案例。请查看完整 ' : "Aucune publication pour ce service pour l'instant. Retrouvez toute notre actualité dans le "}<Link to="/journal" style={{ color: '#12b3d6' }}>{t("journal")}</Link>.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {pubs.map((a) => (
                <Link key={a.id} to={`/journal/${a.id}`}
                  style={{ background: '#0a1526', borderRadius: 14, overflow: 'hidden', border: '1px solid #12233a', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#fff' }}>
                  <div style={{ position: 'relative', height: 170, background: '#07101f' }}>
                    {a.image_principale && (
                      <img src={httpsUrl(a.image_principale)} alt={a.titre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                    {a.a_video && <span style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,.7)', color: '#fff', fontSize: 12, padding: '3px 9px', borderRadius: 20 }}>🎬</span>}
                  </div>
                  <div style={{ padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#63798f' }}>{formatDate(a.date_publication, language)}</span>
                    <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, color: '#fff' }}>{tDynamic(a.titre)}</div>
                    {a.extrait && <div style={{ color: '#9fb3c8', fontSize: 12.5, lineHeight: 1.5 }}>{tDynamic(a.extrait)}</div>}
                    <span style={{ marginTop: 'auto', color: '#12b3d6', fontWeight: 700, fontSize: 13 }}>
                      {language === 'en' ? 'Read →' : language === 'zh' ? '阅读 →' : 'Lire →'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
