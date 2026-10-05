import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getCategoriesProduits, getProduits } from '../../services/authService';
import { addToCart } from '../../services/cart';
import './catalogue.css';

const WHATSAPP_PHONE = '22890748465';

/* ── ICÔNES VECTORIELLES PROFESSIONNELLES (ZÉRO EMOJI) ── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.031 2C6.495 2 2 6.494 2 12.029c0 1.956.562 3.869 1.63 5.534L2 22l4.606-1.599A9.99 9.99 0 0012.03 22c5.536 0 10.03-4.494 10.03-10.029C22.06 6.494 17.567 2 12.031 2zm0 18.272c-1.688 0-3.33-.454-4.767-1.31l-.341-.205-3.036 1.055 1.077-2.955-.224-.356a8.217 8.217 0 01-1.266-4.477c0-4.562 3.712-8.274 8.277-8.274 4.565 0 8.276 3.712 8.276 8.274 0 4.562-3.711 8.273-8.276 8.273zm4.536-6.195c-.248-.124-1.468-.724-1.696-.807-.228-.083-.394-.124-.56.124-.166.248-.642.807-.787.973-.145.166-.29.186-.538.062-.249-.124-1.049-.386-1.999-1.233-.739-.658-1.238-1.472-1.383-1.72-.145-.248-.016-.382.108-.506.112-.112.249-.29.373-.435.124-.145.166-.248.249-.414.083-.166.041-.311-.021-.435-.062-.124-.56-1.349-.767-1.847-.202-.485-.407-.419-.56-.427l-.477-.008c-.166 0-.435.062-.663.311-.228.248-.871.85-.871 2.073 0 1.223.892 2.404 1.016 2.57 0 .166 1.755 2.68 4.252 3.757.594.256 1.058.41 1.42.525.597.19 1.14.163 1.57.099.479-.071 1.468-.6 1.675-1.18.207-.58.207-1.077.145-1.18-.062-.103-.228-.166-.477-.29z" />
  </svg>
);

const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const GridIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const SupportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

const getPriceValue = (price) => {
  const digits = String(price || '').replace(/\D/g, '');
  return digits ? Number(digits) : null;
};

const formatPrice = (price, language) => {
  const value = getPriceValue(price);
  if (value === null) return price || '';

  const locale = language === 'en' ? 'en-US' : language === 'zh' ? 'zh-CN' : 'fr-FR';
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value)} FCFA`;
};

export default function Galerie() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [added, setAdded] = useState({});
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickPhotoIdx, setQuickPhotoIdx] = useState(0);

  const { t, tDynamic, language } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getProduits().catch(() => ({ data: [] })),
      getCategoriesProduits().catch(() => ({ data: [] }))
    ]).then(([prodRes, catRes]) => {
      if (!isMounted) return;
      const activeProducts = (prodRes.data || []).filter((p) => p.est_actif);
      setProduits(activeProducts);
      setCategories(catRes.data || []);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fermer la modal avec Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    if (quickViewProduct) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [quickViewProduct]);

  // Nombre d'articles par catégorie
  const categoryCounts = useMemo(() => {
    const counts = { total: produits.length };
    produits.forEach((p) => {
      if (p.categorie_slug) {
        counts[p.categorie_slug] = (counts[p.categorie_slug] || 0) + 1;
      }
    });
    return counts;
  }, [produits]);

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return produits.filter((p) => {
      if (cat && p.categorie_slug !== cat) return false;
      if (inStockOnly && p.quantite_disponible === 0) return false;
      if (!q) return true;

      const searchable = [
        tDynamic(p.nom),
        p.nom,
        p.prix,
        tDynamic(p.categorie_nom),
        p.description,
        p.caracteristiques
      ].filter(Boolean).join(' ').toLowerCase();

      return searchable.includes(q);
    }).sort((a, b) => {
      if (sort === 'price-asc' || sort === 'price-desc') {
        const firstPrice = getPriceValue(a.prix);
        const secondPrice = getPriceValue(b.prix);
        if (firstPrice === null) return 1;
        if (secondPrice === null) return -1;
        return sort === 'price-asc' ? firstPrice - secondPrice : secondPrice - firstPrice;
      }

      if (sort === 'name-asc') {
        return (a.nom || '').localeCompare(b.nom || '');
      }

      const dateDiff = new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return dateDiff || Number(b.id) - Number(a.id);
    });
  }, [produits, cat, inStockOnly, q, sort, tDynamic]);

  const handleAdd = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p, 1);
    setAdded((a) => ({ ...a, [p.id]: true }));
    setTimeout(() => setAdded((a) => ({ ...a, [p.id]: false })), 1400);
  };

  const getWhatsAppUrl = (p) => {
    const priceText = p.prix ? `${p.prix} FCFA` : 'Sur devis';
    const message = `Bonjour OPTINET SARL U,\nJe souhaite commander l'article suivant :\n*${p.nom}*\nPrix : *${priceText}*\nRéférence : ${p.uuid || p.id}\n\nPouvez-vous me confirmer la disponibilité et les modalités de livraison ?`;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  };

  const openQuickView = (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickPhotoIdx(0);
    setQuickViewProduct(p);
  };

  return (
    <section className="gallery-page">
      <div className="gallery-container">

        {/* ── HERO BANNER PRO ── */}
        <div className="gallery-hero">
          <div className="gallery-hero__badge">
            <span className="gallery-hero__dot" />
            <span className="gallery-hero__badge-text">OPTINET SARL U • CATALOGUE OFFICIEL</span>
          </div>

          <h1 className="gallery-hero__title">
            {t("articles")} & Solutions Tech
          </h1>

          <p className="gallery-hero__desc">
            {t("announcements_subtitle")} Matériel informatique d'entreprise, réseaux, serveurs et accessoires certifiés avec garantie et support dédié.
          </p>

          <div className="gallery-hero__highlights">
            <div className="gallery-hero__pill">
              <span className="gallery-hero__pill-icon"><ShieldIcon /></span>
              <span>Matériel testé & garanti</span>
            </div>
            <div className="gallery-hero__pill">
              <span className="gallery-hero__pill-icon"><TruckIcon /></span>
              <span>Livraison express à Lomé & Togo</span>
            </div>
            <div className="gallery-hero__pill">
              <span className="gallery-hero__pill-icon"><SupportIcon /></span>
              <span>Conseil technique direct WhatsApp</span>
            </div>
          </div>
        </div>

        {/* ── BARRE DE RECHERCHE ── */}
        <div className="gallery-search-bar">
          <div className="gallery-search-input-wrap">
            <span className="gallery-search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher par équipement, modèle, référence, catégorie..."
              aria-label={t("search")}
              className="gallery-search-input"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t("clear_search")}
                className="gallery-search-clear"
              >
                &times;
              </button>
            )}
          </div>

          <div className="gallery-search-meta">
            <span className="gallery-counter-pill">
              <strong>{loading ? '...' : filtered.length}</strong> {t(filtered.length <= 1 ? "gallery_product_singular" : "gallery_product_plural")}
            </span>
          </div>
        </div>

        {/* ── FILTRES CATÉGORIES (PILLS ÉLÉGANTES SANS EMOJI) ── */}
        <div className="gallery-categories-container">
          <div className="gallery-categories" role="tablist" aria-label={t("filter_category")}>
            <button
              type="button"
              onClick={() => setCat('')}
              className={`gallery-category-pill${cat === '' ? ' gallery-category-pill--active' : ''}`}
              aria-selected={cat === ''}
            >
              <span className="gallery-category-pill__label">{t("all_categories")}</span>
              <span className="gallery-category-pill__badge">{categoryCounts.total || 0}</span>
            </button>

            {categories.map((c) => {
              const count = categoryCounts[c.slug] || 0;
              if (count === 0 && !loading) return null;
              return (
                <button
                  type="button"
                  key={c.slug || c.id}
                  onClick={() => setCat(c.slug)}
                  className={`gallery-category-pill${cat === c.slug ? ' gallery-category-pill--active' : ''}`}
                  aria-selected={cat === c.slug}
                >
                  <span className="gallery-category-pill__label">{tDynamic(c.nom)}</span>
                  <span className="gallery-category-pill__badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TOOLBAR DE TRI & VUE ── */}
        <div className="gallery-toolbar-pro">
          <div className="gallery-toolbar-pro__left">
            <label className="gallery-stock-checkbox">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span className="gallery-stock-checkbox__custom" />
              <span>Articles disponibles uniquement</span>
            </label>
          </div>

          <div className="gallery-toolbar-pro__right">
            {/* Tri */}
            <div className="gallery-sort-group">
              <label htmlFor="gallery-sort-select" className="gallery-sort-label">
                <span>{t("sort_by")} :</span>
              </label>
              <div className="gallery-select-wrapper">
                <select
                  id="gallery-sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="gallery-select"
                >
                  <option value="newest">{t("sort_newest")}</option>
                  <option value="price-asc">{t("sort_price_low_high")}</option>
                  <option value="price-desc">{t("sort_price_high_low")}</option>
                  <option value="name-asc">{t("sort_name_asc") || "Nom (A-Z)"}</option>
                </select>
              </div>
            </div>

            {/* Switch Grille / Liste */}
            <div className="gallery-view-switch" role="group" aria-label="Mode d'affichage">
              <button
                type="button"
                className={`gallery-view-btn${viewMode === 'grid' ? ' gallery-view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Affichage en Grille"
                aria-pressed={viewMode === 'grid'}
              >
                <GridIcon />
              </button>
              <button
                type="button"
                className={`gallery-view-btn${viewMode === 'list' ? ' gallery-view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Affichage en Liste détaillée"
                aria-pressed={viewMode === 'list'}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* ── ÉTAT DE CHARGEMENT : SKELETONS ANIMÉS ── */}
        {loading ? (
          <div className="gallery-grid gallery-grid--grid">
            {[...Array(8)].map((_, idx) => (
              <div key={idx} className="gallery-skeleton-card">
                <div className="gallery-skeleton-card__img shimmer-anim" />
                <div className="gallery-skeleton-card__content">
                  <div className="gallery-skeleton-line gallery-skeleton-line--short shimmer-anim" />
                  <div className="gallery-skeleton-line gallery-skeleton-line--title shimmer-anim" />
                  <div className="gallery-skeleton-line gallery-skeleton-line--price shimmer-anim" />
                  <div className="gallery-skeleton-line gallery-skeleton-line--btn shimmer-anim" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* ── ÉTAT VIDE ── */
          <div className="gallery-empty-state">
            <div className="gallery-empty-state__icon">
              <SearchIcon />
            </div>
            <h3>{produits.length === 0 ? t("announcements_empty") : t("gallery_no_results")}</h3>
            <p>Essayez de modifier vos termes de recherche ou de réinitialiser les filtres.</p>
            {(query || cat || inStockOnly) && (
              <button
                type="button"
                className="gallery-btn-reset"
                onClick={() => {
                  setQuery('');
                  setCat('');
                  setInStockOnly(false);
                }}
              >
                {t("gallery_reset_filters")}
              </button>
            )}
          </div>
        ) : (
          /* ── GRILLE / LISTE DES ARTICLES ── */
          <div className={`gallery-grid gallery-grid--${viewMode}`}>
            {filtered.map((p) => {
              const inStock = p.quantite_disponible === null || p.quantite_disponible > 0;
              const photosCount = p.nb_photos || (p.photos ? p.photos.length : 1);

              return (
                <article className="gallery-card" key={p.uuid || p.id}>
                  {/* ZONE IMAGE */}
                  <div className="gallery-card__media">
                    <Link
                      to={`/articles/${p.uuid || p.id}`}
                      className="gallery-card__img-link"
                      aria-label={`${t("view_details")}: ${tDynamic(p.nom || 'Article OPTINET')}`}
                    >
                      {p.image_principale ? (
                        <img
                          src={httpsUrl(p.image_principale)}
                          alt={tDynamic(p.nom || 'Article OPTINET')}
                          loading="lazy"
                          decoding="async"
                          className="gallery-card__img"
                        />
                      ) : (
                        <div className="gallery-card__placeholder">
                          <span>OPTINET</span>
                        </div>
                      )}
                    </Link>

                    {/* BADGES FLOTTANTS SUR L'IMAGE */}
                    <div className="gallery-card__badges-top">
                      {p.categorie_nom && (
                        <span className="gallery-card__badge-cat">
                          {tDynamic(p.categorie_nom)}
                        </span>
                      )}

                      <span className={`gallery-card__badge-stock ${inStock ? 'gallery-card__badge-stock--in' : 'gallery-card__badge-stock--out'}`}>
                        <span className="gallery-card__stock-bullet" />
                        {inStock ? 'En stock' : 'Sur commande'}
                      </span>
                    </div>

                    {/* COMPTEUR DE PHOTOS */}
                    {photosCount > 1 && (
                      <span className="gallery-card__badge-photos">
                        {photosCount} {t("gallery_photos")}
                      </span>
                    )}

                    {/* BOUTON APERÇU RAPIDE */}
                    <button
                      type="button"
                      className="gallery-card__quick-btn"
                      onClick={(e) => openQuickView(e, p)}
                      title="Aperçu rapide"
                      aria-label="Aperçu rapide"
                    >
                      <EyeIcon />
                      <span>Aperçu</span>
                    </button>
                  </div>

                  {/* ZONE CONTENU */}
                  <div className="gallery-card__body">
                    <div className="gallery-card__meta-top">
                      <span className="gallery-card__ref">REF-{String(p.id).padStart(4, '0')}</span>
                    </div>

                    <h2 className="gallery-card__title">
                      <Link to={`/articles/${p.uuid || p.id}`} className="gallery-card__title-link">
                        {tDynamic(p.nom || 'Article OPTINET')}
                      </Link>
                    </h2>

                    {/* Aperçu description pour vue Liste */}
                    {viewMode === 'list' && p.description && (
                      <p className="gallery-card__desc-preview">
                        {p.description.slice(0, 140)}...
                      </p>
                    )}

                    {/* PRIX */}
                    <div className="gallery-card__price-row">
                      <div className="gallery-card__price">
                        {p.prix ? formatPrice(p.prix, language) : t("gallery_price_contact")}
                      </div>
                      <span className="gallery-card__tax">TTC</span>
                    </div>

                    {/* BOUTONS D'ACTION */}
                    <div className="gallery-card__actions">
                      {/* Bouton WhatsApp direct */}
                      <a
                        href={getWhatsAppUrl(p)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gallery-card__btn-wa"
                        title="Commander directement sur WhatsApp"
                        aria-label="Commander sur WhatsApp"
                      >
                        <WhatsAppIcon />
                        <span className="gallery-card__wa-label">WhatsApp</span>
                      </a>

                      {/* Bouton Ajouter au Panier */}
                      <button
                        type="button"
                        onClick={(e) => handleAdd(e, p)}
                        className={`gallery-card__btn-cart${added[p.id] ? ' gallery-card__btn-cart--added' : ''}`}
                        aria-label={`${t("add_to_cart")}: ${tDynamic(p.nom || 'Article OPTINET')}`}
                      >
                        {added[p.id] ? (
                          <>
                            <CheckIcon />
                            <span>{t("gallery_added")}</span>
                          </>
                        ) : (
                          <>
                            <CartIcon />
                            <span>{t("cart")}</span>
                          </>
                        )}
                      </button>

                      {/* Bouton Voir détails */}
                      <Link
                        to={`/articles/${p.uuid || p.id}`}
                        className="gallery-card__btn-detail"
                        title={t("view_details")}
                        aria-label={t("view_details")}
                      >
                        <ArrowRightIcon />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── BANNIÈRE DE RÉASSURANCE COMMERCIALE (TRUST BANNER) ── */}
        <div className="gallery-trust-banner">
          <div className="gallery-trust-card">
            <div className="gallery-trust-card__icon"><TruckIcon /></div>
            <div className="gallery-trust-card__text">
              <h3>{t("trust_delivery_title") || "Livraison Express"}</h3>
              <p>{t("trust_delivery_desc") || "Livraison le jour même à Lomé et expédition sécurisée partout au Togo."}</p>
            </div>
          </div>

          <div className="gallery-trust-card">
            <div className="gallery-trust-card__icon"><ShieldIcon /></div>
            <div className="gallery-trust-card__text">
              <h3>{t("trust_warranty_title") || "Matériel Garanti"}</h3>
              <p>{t("trust_warranty_desc") || "Équipements vérifiés, testés et garantis par nos ingénieurs experts."}</p>
            </div>
          </div>

          <div className="gallery-trust-card">
            <div className="gallery-trust-card__icon"><CardIcon /></div>
            <div className="gallery-trust-card__text">
              <h3>{t("trust_payment_title") || "Paiement Flexible"}</h3>
              <p>{t("trust_payment_desc") || "Paiement à la livraison, en espèces, via T-Money, Flooz ou virement."}</p>
            </div>
          </div>

          <div className="gallery-trust-card">
            <div className="gallery-trust-card__icon"><SupportIcon /></div>
            <div className="gallery-trust-card__text">
              <h3>{t("trust_support_title") || "Conseils & SAV"}</h3>
              <p>{t("trust_support_desc") || "Assistance technique personnalisée et accompagnement après-vente."}</p>
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL APERÇU RAPIDE (QUICK VIEW) ── */}
      {quickViewProduct && (
        <div
          className="gallery-modal-overlay"
          onClick={() => setQuickViewProduct(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quickview-title"
        >
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="gallery-modal__close"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Fermer"
            >
              &times;
            </button>

            <div className="gallery-modal__grid">
              {/* Galerie Photos Modal */}
              <div className="gallery-modal__gallery">
                <div className="gallery-modal__main-img-wrap">
                  {quickViewProduct.photos && quickViewProduct.photos.length > 0 ? (
                    <img
                      src={httpsUrl(quickViewProduct.photos[quickPhotoIdx]?.image || quickViewProduct.image_principale)}
                      alt={quickViewProduct.nom}
                      className="gallery-modal__main-img"
                    />
                  ) : quickViewProduct.image_principale ? (
                    <img
                      src={httpsUrl(quickViewProduct.image_principale)}
                      alt={quickViewProduct.nom}
                      className="gallery-modal__main-img"
                    />
                  ) : (
                    <div className="gallery-modal__no-img">Aucune photo</div>
                  )}
                </div>

                {quickViewProduct.photos && quickViewProduct.photos.length > 1 && (
                  <div className="gallery-modal__thumbs">
                    {quickViewProduct.photos.map((ph, idx) => (
                      <button
                        type="button"
                        key={ph.id || idx}
                        onClick={() => setQuickPhotoIdx(idx)}
                        className={`gallery-modal__thumb${quickPhotoIdx === idx ? ' gallery-modal__thumb--active' : ''}`}
                      >
                        <img src={httpsUrl(ph.image)} alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Détails Produit Modal */}
              <div className="gallery-modal__info">
                {quickViewProduct.categorie_nom && (
                  <span className="gallery-modal__category">
                    {tDynamic(quickViewProduct.categorie_nom)}
                  </span>
                )}

                <h2 id="quickview-title" className="gallery-modal__title">
                  {tDynamic(quickViewProduct.nom)}
                </h2>

                <div className="gallery-modal__price">
                  {quickViewProduct.prix ? formatPrice(quickViewProduct.prix, language) : t("gallery_price_contact")}
                </div>

                <div className="gallery-modal__stock">
                  <span className="gallery-modal__stock-dot" />
                  <span>En stock immédiat dans nos locaux de Lomé</span>
                </div>

                {quickViewProduct.description && (
                  <div className="gallery-modal__desc">
                    <p>{quickViewProduct.description}</p>
                  </div>
                )}

                {/* Caractéristiques techniques */}
                {quickViewProduct.caracteristiques && (
                  <div className="gallery-modal__specs">
                    <h4>Points clés :</h4>
                    <ul>
                      {quickViewProduct.caracteristiques.split('\n').filter(Boolean).slice(0, 4).map((line, i) => (
                        <li key={i}>{line.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions Modal */}
                <div className="gallery-modal__actions">
                  <a
                    href={getWhatsAppUrl(quickViewProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gallery-modal__btn-wa"
                  >
                    <WhatsAppIcon />
                    <span>Commander sur WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={(e) => handleAdd(e, quickViewProduct)}
                    className={`gallery-modal__btn-cart${added[quickViewProduct.id] ? ' gallery-modal__btn-cart--added' : ''}`}
                  >
                    {added[quickViewProduct.id] ? (
                      <>
                        <CheckIcon />
                        <span>Ajouté au panier</span>
                      </>
                    ) : (
                      <>
                        <CartIcon />
                        <span>Ajouter au panier</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/articles/${quickViewProduct.uuid || quickViewProduct.id}`}
                    className="gallery-modal__btn-full"
                    onClick={() => setQuickViewProduct(null)}
                  >
                    Voir la fiche complète &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
