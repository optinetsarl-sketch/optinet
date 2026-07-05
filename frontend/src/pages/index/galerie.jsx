import React, { useState, useEffect } from 'react';
import { getPhotos } from '../../services/authService';

const httpsUrl = (u) => {
  if (!u) return '';
  // En local le serveur Django est http ; on ne force https que pour les domaines en ligne
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};
const WHATSAPP = '22890748465';

export default function Galerie() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getPhotos()
      .then((res) => setArticles((res.data || []).filter((p) => p.est_actif)))
      .catch((e) => console.error('Erreur chargement articles:', e))
      .finally(() => setLoading(false));
  }, []);

  const waLink = (a) =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      `Bonjour OPTINET SARL U, je suis intéressé(e) par : ${a.titre || 'cet article'}` +
      `${a.prix ? ' (' + a.prix + ')' : ''}. Est-il toujours disponible ?`
    )}`;

  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{ color: '#12b3d6', fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>BOUTIQUE</span>
          <h2 style={{ fontSize: 38, fontWeight: 800, margin: '8px 0' }}>Nos Articles 🛒</h2>
          <p style={{ color: '#9fb3c8' }}>
            Ordinateurs, téléphones et matériel — commandez directement sur WhatsApp.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Chargement…</p>
        ) : articles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Aucun article pour le moment.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 22 }}>
            {articles.map((a) => (
              <div key={a.id} style={{ background: '#0a1526', borderRadius: 16, overflow: 'hidden', border: '1px solid #12233a', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setSelected(a)}>
                  <img src={httpsUrl(a.image_principale)} alt={a.titre} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  {a.prix && (
                    <span style={{ position: 'absolute', bottom: 10, left: 10, background: '#11b981', color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 12px', borderRadius: 20 }}>
                      {a.prix}
                    </span>
                  )}
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{a.titre || 'Article OPTINET'}</div>
                  {a.description && (
                    <div style={{ color: '#9fb3c8', fontSize: 12.5, lineHeight: 1.5, whiteSpace: 'pre-line', maxHeight: 72, overflow: 'hidden' }}>
                      {a.description.slice(0, 120)}{a.description.length > 120 ? '…' : ''}
                    </div>
                  )}
                  <a href={waLink(a)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                    style={{ marginTop: 'auto', background: '#25D366', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
                    💬 Commander sur WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fiche détail */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#0a1526', borderRadius: 16, maxWidth: 620, width: '100%', maxHeight: '90vh', overflow: 'auto', color: '#fff', border: '1px solid #1b3355' }}>
            <img src={httpsUrl(selected.image_principale)} alt={selected.titre} style={{ width: '100%', maxHeight: 380, objectFit: 'cover' }} />
            <div style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 22 }}>{selected.titre}</h3>
              {selected.prix && <div style={{ color: '#11b981', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>{selected.prix}</div>}
              {selected.description && <p style={{ color: '#cbd7e4', whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: 14 }}>{selected.description}</p>}
              <a href={waLink(selected)} target="_blank" rel="noreferrer"
                style={{ display: 'block', marginTop: 16, background: '#25D366', color: '#fff', textAlign: 'center', padding: '12px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
                💬 Commander sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
