import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProduits, getCategoriesProduits } from '../../services/authService';
import { addToCart } from '../../services/cart';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

export default function Galerie() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');       // slug de la catégorie sélectionnée
  const [added, setAdded] = useState({});    // feedback "Ajouté" par produit

  useEffect(() => {
    getProduits()
      .then((res) => setProduits((res.data || []).filter((p) => p.est_actif)))
      .catch((e) => console.error('Erreur chargement produits:', e))
      .finally(() => setLoading(false));
    getCategoriesProduits()
      .then((res) => setCategories((res.data || []).filter((c) => c.nb_produits > 0)))
      .catch(() => {});
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = produits.filter((p) => {
    if (cat && p.categorie_slug !== cat) return false;
    if (q && !((p.nom || '') + ' ' + (p.prix || '')).toLowerCase().includes(q)) return false;
    return true;
  });

  const handleAdd = (e, p) => {
    e.preventDefault(); e.stopPropagation();
    addToCart(p, 1);
    setAdded((a) => ({ ...a, [p.id]: true }));
    setTimeout(() => setAdded((a) => ({ ...a, [p.id]: false })), 1400);
  };

  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <span style={{ color: '#12b3d6', fontWeight: 800, letterSpacing: 2, fontSize: 13 }}>BOUTIQUE</span>
          <h2 style={{ fontSize: 38, fontWeight: 800, margin: '8px 0' }}>Nos Articles 🛒</h2>
          <p style={{ color: '#9fb3c8' }}>
            Ajoutez au panier, puis commandez à la livraison ou sur WhatsApp.
          </p>
        </div>

        {/* Recherche */}
        <div style={{ maxWidth: 520, margin: '0 auto 20px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#63798f', fontSize: 16 }}>🔍</span>
          <input
            type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article (nom, prix…)"
            style={{ width: '100%', background: '#0a1526', border: '1px solid #16283f', borderRadius: 30, padding: '13px 18px 13px 44px', color: '#fff', fontSize: 15, outline: 'none' }}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Effacer"
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9fb3c8', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
          )}
        </div>

        {/* Filtres catégories */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 34 }}>
            {[{ slug: '', nom: 'Tout' }, ...categories].map((c) => (
              <button key={c.slug || 'tout'} onClick={() => setCat(c.slug)}
                style={{
                  fontSize: 13.5, fontWeight: 700, padding: '8px 16px', borderRadius: 22, cursor: 'pointer',
                  border: `1px solid ${cat === c.slug ? '#12b3d6' : '#16283f'}`,
                  background: cat === c.slug ? '#12b3d6' : 'transparent',
                  color: cat === c.slug ? '#03121f' : '#9fb3c8',
                }}>
                {c.nom}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>Chargement…</p>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9fb3c8' }}>
            {produits.length === 0 ? 'Aucun article pour le moment.' : 'Aucun article ne correspond.'}
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 22 }}>
            {filtered.map((p) => (
              <Link
                key={p.id} to={`/articles/${p.id}`}
                style={{ background: '#0a1526', borderRadius: 16, overflow: 'hidden', border: '1px solid #12233a', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: '#fff', transition: 'transform .15s, border-color .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = '#12b3d6'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = '#12233a'; }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={httpsUrl(p.image_principale)} alt={p.nom}
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block', background: '#07101f' }} />
                  {p.prix && (
                    <span style={{ position: 'absolute', bottom: 10, left: 10, background: '#11b981', color: '#fff', fontWeight: 800, fontSize: 14, padding: '5px 12px', borderRadius: 20 }}>{p.prix}</span>
                  )}
                  {p.nb_photos > 1 && (
                    <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.65)', color: '#fff', fontWeight: 700, fontSize: 12, padding: '4px 9px', borderRadius: 20 }}>📷 {p.nb_photos}</span>
                  )}
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  {p.categorie_nom && <span style={{ fontSize: 11, color: '#63798f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>{p.categorie_nom}</span>}
                  <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{p.nom || 'Article OPTINET'}</div>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                    <span style={{ flex: 1, background: 'transparent', border: '1px solid #12b3d6', color: '#12b3d6', textAlign: 'center', padding: '9px', borderRadius: 10, fontWeight: 700, fontSize: 13 }}>
                      Détails
                    </span>
                    <button onClick={(e) => handleAdd(e, p)}
                      style={{ flex: 1, background: added[p.id] ? '#11b981' : '#12b3d6', color: '#03121f', border: 'none', padding: '9px', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                      {added[p.id] ? 'Ajouté ✓' : '+ Panier'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
