import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduitDetail } from '../../services/authService';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};
const WHATSAPP = '22890748465';

export default function ProduitDetail() {
  const { id } = useParams();
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(false);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduitDetail(id)
      .then((res) => { setProduit(res.data); setCurrent(0); })
      .catch(() => setErreur(true))
      .finally(() => setLoading(false));
  }, [id]);

  const photos = produit?.photos?.length
    ? produit.photos
    : (produit?.image_principale ? [{ id: 0, image: produit.image_principale }] : []);

  const go = (delta) => {
    if (!photos.length) return;
    setCurrent((c) => (c + delta + photos.length) % photos.length);
  };

  const waLink = () =>
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      `Bonjour OPTINET SARL U, je suis intéressé(e) par : ${produit?.nom || 'cet article'}` +
      `${produit?.prix ? ' (' + produit.prix + ')' : ''}. Est-il toujours disponible ?`
    )}`;

  if (loading) return <Wrap><p style={{ color: '#9fb3c8', textAlign: 'center' }}>Chargement…</p></Wrap>;
  if (erreur || !produit) return (
    <Wrap>
      <p style={{ color: '#9fb3c8', textAlign: 'center' }}>Article introuvable.</p>
      <div style={{ textAlign: 'center', marginTop: 16 }}><Link to="/galerie" style={backBtn}>← Retour à la boutique</Link></div>
    </Wrap>
  );

  const specs = produit.caracteristiques_list || [];

  return (
    <Wrap>
      <Link to="/galerie" style={{ ...backBtn, display: 'inline-block', marginBottom: 24 }}>← Retour à la boutique</Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)', gap: 34, alignItems: 'start' }} className="pd-grid">
        {/* ---------- Galerie ---------- */}
        <div>
          <div style={{ position: 'relative', background: '#07101f', borderRadius: 16, overflow: 'hidden', border: '1px solid #12233a' }}>
            <img
              src={httpsUrl(photos[current]?.image)}
              alt={produit.nom}
              onClick={() => setZoom(true)}
              style={{ width: '100%', height: 420, objectFit: 'contain', display: 'block', cursor: 'zoom-in' }}
            />
            {photos.length > 1 && (
              <>
                <button onClick={() => go(-1)} style={{ ...navBtn, left: 10 }} aria-label="Précédent">‹</button>
                <button onClick={() => go(1)} style={{ ...navBtn, right: 10 }} aria-label="Suivant">›</button>
                <span style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,.6)', padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>
                  {current + 1} / {photos.length}
                </span>
              </>
            )}
          </div>

          {photos.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
              {photos.map((ph, i) => (
                <img
                  key={ph.id ?? i}
                  src={httpsUrl(ph.image)}
                  alt=""
                  onClick={() => setCurrent(i)}
                  style={{
                    width: 74, height: 74, objectFit: 'cover', borderRadius: 10, cursor: 'pointer',
                    border: i === current ? '2px solid #12b3d6' : '2px solid transparent', opacity: i === current ? 1 : 0.7,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ---------- Infos ---------- */}
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>{produit.nom}</h1>
          {produit.prix && (
            <div style={{ color: '#11b981', fontWeight: 800, fontSize: 30, marginBottom: 20 }}>{produit.prix}</div>
          )}

          <a href={waLink()} target="_blank" rel="noreferrer"
            style={{ display: 'block', background: '#25D366', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', fontSize: 16, marginBottom: 24 }}>
            💬 Commander sur WhatsApp
          </a>

          {specs.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 10px' }}>Caractéristiques</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <tbody>
                  {specs.map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #12233a' }}>
                      {s.nom
                        ? <>
                            <td style={{ padding: '9px 10px', color: '#9fb3c8', fontWeight: 600, width: '42%', verticalAlign: 'top' }}>{s.nom}</td>
                            <td style={{ padding: '9px 10px', color: '#e6edf5' }}>{s.valeur}</td>
                          </>
                        : <td colSpan={2} style={{ padding: '9px 10px', color: '#e6edf5' }}>{s.valeur}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {produit.description && (
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: '0 0 10px' }}>Description</h3>
              <p style={{ color: '#cbd7e4', whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: 14.5, margin: 0 }}>
                {produit.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Lightbox zoom ---------- */}
      {zoom && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 2000 }}>
          <img src={httpsUrl(photos[current]?.image)} alt={produit.nom} style={{ maxWidth: '95%', maxHeight: '92%', objectFit: 'contain', borderRadius: 8 }} onClick={(e) => e.stopPropagation()} />
          {photos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} style={{ ...navBtn, left: 16, width: 52, height: 52 }}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} style={{ ...navBtn, right: 16, width: 52, height: 52 }}>›</button>
            </>
          )}
          <button onClick={() => setZoom(false)} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', color: '#fff', fontSize: 34, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
      )}

      <style>{`@media (max-width: 820px){ .pd-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </Wrap>
  );
}

function Wrap({ children }) {
  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

const backBtn = { color: '#12b3d6', textDecoration: 'none', fontWeight: 700, fontSize: 14 };
const navBtn = {
  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
  width: 42, height: 42, borderRadius: '50%', border: 'none',
  background: 'rgba(0,0,0,.55)', color: '#fff', fontSize: 26, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
};
