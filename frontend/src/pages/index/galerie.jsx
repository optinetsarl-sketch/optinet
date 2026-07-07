import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProduits } from '../../services/authService';

const httpsUrl = (u) => {
  if (!u) return '';
  // En local le serveur Django est http ; on ne force https que pour les domaines en ligne
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

export default function Galerie() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduits()
      .then((res) => setProduits((res.data || []).filter((p) => p.est_actif)))
      .catch((e) => console.error('Erreur chargement produits:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ color: '#12b3d6', fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>BOUTIQUE</span>
          <h2 style={{ fontSize: 38, fontWeight: 800, margin: '8px 0' }}>Nos Articles 🛒</h2>
          <p style={{ color: '#9fb3c8' }}>
            Ordinateurs, téléphones et matériel — cliquez sur un article pour voir toutes les photos et détails.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Chargement…</p>
        ) : produits.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Aucun article pour le moment.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 22 }}>
            {produits.map((p) => (
              <Link
                key={p.id}
                to={`/articles/${p.id}`}
                style={{ background: '#0a1526', borderRadius: 16, overflow: 'hidden', border: '1px solid #12233a', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#fff', transition: 'transform .15s, border-color .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#12b3d6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#12233a'; }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={httpsUrl(p.image_principale)}
                    alt={p.nom}
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', background: '#07101f' }}
                  />
                  {p.prix && (
                    <span style={{ position: 'absolute', bottom: 10, left: 10, background: '#11b981', color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 12px', borderRadius: 20 }}>
                      {p.prix}
                    </span>
                  )}
                  {p.nb_photos > 1 && (
                    <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.65)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '4px 9px', borderRadius: 20 }}>
                      📷 {p.nb_photos}
                    </span>
                  )}
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{p.nom || 'Article OPTINET'}</div>
                  <span style={{ marginTop: 'auto', background: '#12b3d6', color: '#03121f', textAlign: 'center', padding: '9px', borderRadius: 10, fontWeight: 800, fontSize: 13.5 }}>
                    Voir détails →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
