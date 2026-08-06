import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getActualiteDetail } from '../../services/authService';
import { catColor, formatDate } from './Journal';
import { useLanguage } from '../../context/LanguageContext';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

export default function ActualiteDetail() {
  const { id } = useParams();
  const [a, setA] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(false);
  const [current, setCurrent] = useState(0);
  const [zoom, setZoom] = useState(false);
  const { t, tDynamic, language } = useLanguage();

  useEffect(() => {
    setLoading(true);
    getActualiteDetail(id)
      .then((res) => { setA(res.data); setCurrent(0); })
      .catch(() => setErreur(true))
      .finally(() => setLoading(false));
  }, [id]);

  const photos = a?.photos || [];
  const go = (d) => photos.length && setCurrent((c) => (c + d + photos.length) % photos.length);

  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = a ? `${tDynamic(a.titre)} — OPTINET SARL U` : '';
  const shares = [
    { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}` },
    { label: 'Facebook', color: '#2a5fd0', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
    { label: 'LinkedIn', color: '#0a66c2', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
  ];

  if (loading) return <Wrap><p style={{ color: '#9fb3c8', textAlign: 'center' }}>Chargement…</p></Wrap>;
  if (erreur || !a) return (
    <Wrap>
      <p style={{ color: '#9fb3c8', textAlign: 'center' }}>Publication introuvable.</p>
      <div style={{ textAlign: 'center', marginTop: 16 }}><Link to="/journal" style={backBtn}>← {t("journal")}</Link></div>
    </Wrap>
  );

  const col = catColor(a.categorie);

  return (
    <Wrap>
      <Link to="/journal" style={{ ...backBtn, display: 'inline-block', marginBottom: 22 }}>← {t("journal")}</Link>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ background: col, color: '#03121f', fontWeight: 800, fontSize: 12, letterSpacing: .5, padding: '5px 12px', borderRadius: 20, textTransform: 'uppercase' }}>
          {t(`cat_${a.categorie}`) || a.categorie_label}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#63798f' }}>{formatDate(a.date_publication, language)}</span>
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 22px', lineHeight: 1.2, maxWidth: 900 }}>{tDynamic(a.titre)}</h1>

      {/* Vidéo YouTube */}
      {a.video_embed && (
        <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 16, overflow: 'hidden', marginBottom: 26, border: '1px solid #12233a' }}>
          <iframe
            src={a.video_embed}
            title={a.titre}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Galerie photos */}
      {photos.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ position: 'relative', background: '#07101f', borderRadius: 16, overflow: 'hidden', border: '1px solid #12233a' }}>
            <img
              src={httpsUrl(photos[current]?.image)} alt={a.titre}
              onClick={() => setZoom(true)}
              style={{ width: '100%', maxHeight: 460, objectFit: 'contain', display: 'block', cursor: 'zoom-in' }}
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
                <img key={ph.id ?? i} src={httpsUrl(ph.image)} alt="" onClick={() => setCurrent(i)}
                  style={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 10, cursor: 'pointer', border: i === current ? `2px solid ${col}` : '2px solid transparent', opacity: i === current ? 1 : 0.7 }} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Récit */}
      {a.contenu && (
        <p style={{ color: '#cbd7e4', whiteSpace: 'pre-line', lineHeight: 1.8, fontSize: 16, maxWidth: 760, margin: '0 0 30px' }}>
          {tDynamic(a.contenu)}
        </p>
      )}

      {/* Partage */}
      <div style={{ borderTop: '1px solid #12233a', paddingTop: 20, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ color: '#9fb3c8', fontWeight: 700, fontSize: 14 }}>
          {language === 'en' ? 'Share:' : language === 'zh' ? '分享到:' : 'Partager :'}
        </span>
        {shares.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
            style={{ background: s.color, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: 13.5, padding: '9px 16px', borderRadius: 10 }}>
            {s.label}
          </a>
        ))}
      </div>

      {/* Zoom */}
      {zoom && photos.length > 0 && (
        <div onClick={() => setZoom(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 2000 }}>
          <img src={httpsUrl(photos[current]?.image)} alt={a.titre} style={{ maxWidth: '95%', maxHeight: '92%', objectFit: 'contain', borderRadius: 8 }} onClick={(e) => e.stopPropagation()} />
          {photos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} style={{ ...navBtn, left: 16, width: 52, height: 52 }}>‹</button>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} style={{ ...navBtn, right: 16, width: 52, height: 52 }}>›</button>
            </>
          )}
          <button onClick={() => setZoom(false)} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', color: '#fff', fontSize: 34, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
      )}
    </Wrap>
  );
}

function Wrap({ children }) {
  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>{children}</div>
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

