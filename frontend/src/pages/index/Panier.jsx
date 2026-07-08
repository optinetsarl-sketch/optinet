import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, setQuantite, removeFromCart, clearCart, cartTotal, formatFCFA } from '../../services/cart';
import { createCommande } from '../../services/authService';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};
const WHATSAPP = '22890748465';

export default function Panier() {
  const [items, setItems] = useState(getCart());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_nom: '', client_telephone: '', client_adresse: '', client_ville: '', note: '' });
  const [sending, setSending] = useState(false);
  const [erreur, setErreur] = useState('');
  const [done, setDone] = useState(null); // commande créée

  useEffect(() => {
    const refresh = () => setItems(getCart());
    window.addEventListener('cart-updated', refresh);
    return () => window.removeEventListener('cart-updated', refresh);
  }, []);

  const total = cartTotal();

  const recapWhatsApp = () => {
    const lignes = items.map((it) => `- ${it.quantite} × ${it.nom}${it.prix ? ' (' + it.prix + ')' : ''}`).join('\n');
    const msg = `Bonjour OPTINET SARL U, je souhaite commander :\n${lignes}\n\nTotal estimé : ${formatFCFA(total)}`;
    return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  };

  const submitCOD = async (e) => {
    e.preventDefault();
    setErreur('');
    if (!form.client_nom.trim() || !form.client_telephone.trim()) {
      setErreur('Le nom et le téléphone sont requis.');
      return;
    }
    setSending(true);
    try {
      const payload = {
        ...form,
        mode_paiement: 'cod',
        total: formatFCFA(total),
        items: items.map((it) => ({ produit: it.produit, nom: it.nom, prix: it.prix, quantite: it.quantite })),
      };
      const res = await createCommande(payload);
      clearCart();
      setDone(res.data);
    } catch (err) {
      setErreur(err.response?.data?.detail || "Impossible d'enregistrer la commande. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  // ---- Confirmation ----
  if (done) {
    return (
      <Wrap>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', background: '#0a1526', border: '1px solid #12233a', borderRadius: 16, padding: 40 }}>
          <div style={{ fontSize: 54 }}>✅</div>
          <h2 style={{ margin: '10px 0' }}>Commande enregistrée !</h2>
          <p style={{ color: '#9fb3c8' }}>
            Merci {done.client_nom} 🙏 Ta commande <b>#{done.id}</b> ({done.nb_articles} article{done.nb_articles > 1 ? 's' : ''}, {done.total}) a bien été reçue.
            Nous te contactons au <b>{done.client_telephone}</b> pour la livraison (paiement à la réception).
          </p>
          <Link to="/galerie" style={{ display: 'inline-block', marginTop: 18, background: '#12b3d6', color: '#03121f', padding: '12px 22px', borderRadius: 10, fontWeight: 800, textDecoration: 'none' }}>
            ← Continuer mes achats
          </Link>
        </div>
      </Wrap>
    );
  }

  // ---- Panier vide ----
  if (items.length === 0) {
    return (
      <Wrap>
        <div style={{ textAlign: 'center', color: '#9fb3c8', paddingTop: 20 }}>
          <div style={{ fontSize: 54 }}>🛒</div>
          <h2 style={{ color: '#fff', margin: '10px 0' }}>Ton panier est vide</h2>
          <p>Ajoute des articles depuis la boutique.</p>
          <Link to="/galerie" style={{ display: 'inline-block', marginTop: 16, background: '#12b3d6', color: '#03121f', padding: '12px 22px', borderRadius: 10, fontWeight: 800, textDecoration: 'none' }}>
            Voir les articles
          </Link>
        </div>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 20 }}>Mon panier 🛒</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 26, alignItems: 'start' }} className="cart-grid">
        {/* Liste des articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((it) => (
            <div key={it.produit} style={{ display: 'flex', gap: 12, background: '#0a1526', border: '1px solid #12233a', borderRadius: 12, padding: 12, alignItems: 'center' }}>
              <img src={httpsUrl(it.image)} alt={it.nom} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, background: '#07101f', flex: '0 0 auto' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.3 }}>{it.nom}</div>
                {it.prix && <div style={{ color: '#11b981', fontWeight: 700, fontSize: 13, marginTop: 3 }}>{it.prix}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #1b3355', borderRadius: 9, overflow: 'hidden' }}>
                <button onClick={() => setQuantite(it.produit, it.quantite - 1)} style={qtyBtn}>−</button>
                <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 800 }}>{it.quantite}</span>
                <button onClick={() => setQuantite(it.produit, it.quantite + 1)} style={qtyBtn}>+</button>
              </div>
              <button onClick={() => removeFromCart(it.produit)} aria-label="Retirer"
                style={{ background: 'none', border: 'none', color: '#ff6b6b', fontSize: 20, cursor: 'pointer', flex: '0 0 auto' }}>🗑️</button>
            </div>
          ))}
        </div>

        {/* Récap + checkout */}
        <div style={{ background: '#0a1526', border: '1px solid #12233a', borderRadius: 14, padding: 20, position: 'sticky', top: 90 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
            <span>Total</span><span style={{ color: '#11b981' }}>{formatFCFA(total)}</span>
          </div>
          <p style={{ color: '#63798f', fontSize: 12, marginBottom: 18 }}>Total estimé d'après les prix affichés.</p>

          {!showForm ? (
            <>
              <button onClick={() => setShowForm(true)}
                style={{ width: '100%', background: '#12b3d6', color: '#03121f', border: 'none', padding: '13px', borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}>
                💵 Payer à la livraison
              </button>
              <a href={recapWhatsApp()} target="_blank" rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', background: '#25D366', color: '#fff', padding: '13px', borderRadius: 11, fontWeight: 800, fontSize: 15, textDecoration: 'none' }}>
                💬 Commander sur WhatsApp
              </a>
            </>
          ) : (
            <form onSubmit={submitCOD} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Livraison — paiement à la réception</div>
              {erreur && <div style={{ background: 'rgba(255,90,95,.12)', color: '#ffb3b5', padding: '8px 11px', borderRadius: 8, fontSize: 13 }}>{erreur}</div>}
              <input required placeholder="Nom complet *" value={form.client_nom} onChange={(e) => setForm({ ...form, client_nom: e.target.value })} style={inp} />
              <input required placeholder="Téléphone *" value={form.client_telephone} onChange={(e) => setForm({ ...form, client_telephone: e.target.value })} style={inp} />
              <input placeholder="Adresse / quartier" value={form.client_adresse} onChange={(e) => setForm({ ...form, client_adresse: e.target.value })} style={inp} />
              <input placeholder="Ville" value={form.client_ville} onChange={(e) => setForm({ ...form, client_ville: e.target.value })} style={inp} />
              <textarea placeholder="Note (facultatif)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ ...inp, minHeight: 60, resize: 'vertical' }} />
              <button type="submit" disabled={sending}
                style={{ background: '#11b981', color: '#03121f', border: 'none', padding: '13px', borderRadius: 11, fontWeight: 800, fontSize: 15, cursor: sending ? 'default' : 'pointer', opacity: sending ? .7 : 1 }}>
                {sending ? 'Envoi…' : 'Valider ma commande'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#9fb3c8', fontSize: 13, cursor: 'pointer' }}>← Retour</button>
            </form>
          )}
        </div>
      </div>

      <style>{`@media (max-width:820px){ .cart-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </Wrap>
  );
}

function Wrap({ children }) {
  return (
    <section style={{ background: '#020b18', minHeight: '80vh', padding: '96px 20px 64px', color: '#fff' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
    </section>
  );
}

const qtyBtn = { width: 34, height: 36, background: '#07101f', color: '#fff', border: 'none', fontSize: 18, cursor: 'pointer', lineHeight: 1 };
const inp = { background: '#020b18', border: '1px solid #1b3355', borderRadius: 9, padding: '11px 13px', color: '#fff', fontSize: 14.5, fontFamily: 'inherit' };
