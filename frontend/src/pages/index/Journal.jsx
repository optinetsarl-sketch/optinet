import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActualites } from '../../services/authService';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

export const CATS = [
  { key: '', label: 'Tout', color: '#12b3d6' },
  { key: 'intervention', label: 'Interventions terrain', color: '#12b3d6' },
  { key: 'realisation', label: 'Réalisations', color: '#11b981' },
  { key: 'actualite', label: 'Actualités', color: '#6c6cf0' },
  { key: 'annonce', label: 'Annonces', color: '#f0a531' },
];
export const catColor = (k) => (CATS.find((c) => c.key === k) || CATS[0]).color;

export const formatDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch { return ''; }
};

export default function Journal() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('');

  useEffect(() => {
    setLoading(true);
    getActualites(cat)
      .then((res) => setItems((res.data || []).filter((a) => a.est_publie)))
      .catch((e) => console.error('Erreur chargement actualités:', e))
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <span style={{ color: '#12b3d6', fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>JOURNAL</span>
          <h2 style={{ fontSize: 38, fontWeight: 800, margin: '8px 0' }}>Actualités &amp; Interventions 📡</h2>
          <p style={{ color: '#9fb3c8' }}>
            Nos chantiers, nos réalisations et l'actualité d'OPTINET SARL U — en photos et en vidéo.
          </p>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 34 }}>
          {CATS.map((c) => (
            <button key={c.key} onClick={() => setCat(c.key)}
              style={{
                fontSize: 13.5, fontWeight: 700, padding: '8px 16px', borderRadius: 22, cursor: 'pointer',
                border: `1px solid ${cat === c.key ? c.color : '#16283f'}`,
                background: cat === c.key ? c.color : 'transparent',
                color: cat === c.key ? '#03121f' : '#9fb3c8',
              }}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Chargement…</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Aucune publication pour le moment.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 22 }}>
            {items.map((a) => (
              <Link key={a.id} to={`/journal/${a.id}`}
                style={{ background: '#0a1526', borderRadius: 16, overflow: 'hidden', border: '1px solid #12233a', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#fff', transition: 'transform .15s, border-color .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = catColor(a.categorie); }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#12233a'; }}>
                <div style={{ position: 'relative', height: 190, background: '#07101f' }}>
                  {a.image_principale && (
                    <img src={httpsUrl(a.image_principale)} alt={a.titre} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  <span style={{ position: 'absolute', top: 10, left: 10, background: catColor(a.categorie), color: '#03121f', fontWeight: 800, fontSize: 11, letterSpacing: .5, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase' }}>
                    {a.categorie_label}
                  </span>
                  <span style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 6 }}>
                    {a.a_video && <span style={{ background: 'rgba(0,0,0,.7)', color: '#fff', fontSize: 12, padding: '3px 9px', borderRadius: 20 }}>🎬</span>}
                    {a.nb_photos > 0 && <span style={{ background: 'rgba(0,0,0,.7)', color: '#fff', fontSize: 12, padding: '3px 9px', borderRadius: 20 }}>📷 {a.nb_photos}</span>}
                  </span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#63798f', letterSpacing: .5 }}>{formatDate(a.date_publication)}</span>
                  <div style={{ fontWeight: 700, fontSize: 15.5, lineHeight: 1.3 }}>{a.titre}</div>
                  {a.extrait && <div style={{ color: '#9fb3c8', fontSize: 13, lineHeight: 1.5 }}>{a.extrait}</div>}
                  <span style={{ marginTop: 'auto', color: catColor(a.categorie), fontWeight: 700, fontSize: 13.5 }}>Lire la suite →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
