import React, { useState, useEffect } from 'react';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio, getCategories } from '../../services/authService';
import '../styles_admin/portfolio.css';

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState(null);
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    technologies: '',
    lien_projet: '',
    date_realisation: '',
    categorie: '',
    ordre_affichage: 0,
    est_actif: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [portRes, catRes] = await Promise.all([
        getPortfolios(),
        getCategories()
      ]);
      // Sort portfolios by ordre_affichage or id
      const sortedPortfolios = portRes.data.sort((a, b) => a.ordre_affichage - b.ordre_affichage);
      setPortfolios(sortedPortfolios);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const handleOpenForm = (portfolio = null) => {
    setImageFile(null);
    setImagePreview(null);
    if (portfolio) {
      setFormData({
        titre: portfolio.titre || '',
        description: portfolio.description || '',
        technologies: portfolio.technologies || '',
        lien_projet: portfolio.lien_projet || '',
        date_realisation: portfolio.date_realisation || '',
        categorie: portfolio.categorie?.id || '',
        ordre_affichage: portfolio.ordre_affichage || 0,
        est_actif: portfolio.est_actif !== undefined ? portfolio.est_actif : true
      });
      setCurrentPortfolio(portfolio);
    } else {
      setFormData({
        titre: '',
        description: '',
        technologies: '',
        lien_projet: '',
        date_realisation: '',
        categorie: '',
        ordre_affichage: 0,
        est_actif: true
      });
      setCurrentPortfolio(null);
    }
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = (portfolio) => {
    setCurrentPortfolio(portfolio);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet du portfolio ?")) {
      try {
        await deletePortfolio(id);
        fetchData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du projet.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('titre', formData.titre);
    submitData.append('description', formData.description);
    submitData.append('technologies', formData.technologies);
    if (formData.lien_projet) {
      submitData.append('lien_projet', formData.lien_projet);
    }
    if (formData.date_realisation) {
      submitData.append('date_realisation', formData.date_realisation);
    }
    submitData.append('ordre_affichage', formData.ordre_affichage);
    submitData.append('est_actif', formData.est_actif);
    if (formData.categorie) {
      submitData.append('categorie_id', formData.categorie);
    }
    if (imageFile) {
      submitData.append('image_principale', imageFile);
    }

    try {
      if (currentPortfolio) {
        await updatePortfolio(currentPortfolio.id, submitData);
      } else {
        await createPortfolio(submitData);
      }
      setIsFormModalOpen(false);
      fetchData(); // Rafraîchir les données
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error.response?.data || error);
      let errorMsg = "Une erreur s'est produite lors de l'enregistrement. Vérifiez tous les champs requis.";
      if (error.response?.data && typeof error.response.data === 'object') {
        errorMsg += "\n\nDétails : " + JSON.stringify(error.response.data);
      }
      alert(errorMsg);
    }
  };

  return (
    <div className="portfolio-page">
      <div className="portfolio-header">
        <div>
          <h1 className="portfolio-title">Gestion du Portfolio</h1>
          <p className="portfolio-subtitle">Ajoutez, modifiez et présentez vos meilleures réalisations.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenForm()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau Projet
        </button>
      </div>

      {portfolios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          <h3>Aucun projet pour le moment.</h3>
          <p>Commencez par ajouter votre première réalisation !</p>
        </div>
      ) : (
        <div className="portfolio-grid">
          {portfolios.map(item => (
            <div className={`portfolio-card ${!item.est_actif ? 'inactive' : ''}`} key={item.id}>
              <div className="portfolio-img-container" onClick={() => handleOpenDetail(item)} style={{ cursor: 'pointer' }}>
                <img src={item.image_principale || 'https://via.placeholder.com/800x600?text=No+Image'} alt={item.titre} className="portfolio-img" />
                <div className="portfolio-img-overlay">
                  <span style={{ color: 'white', fontWeight: 600 }}>Voir les détails</span>
                </div>
                {!item.est_actif && (
                  <div style={{ position: 'absolute', top: 10, right: 10, background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>
                    Inactif
                  </div>
                )}
              </div>
              <div className="portfolio-card-content">
                <h3 className="portfolio-card-title">{item.titre}</h3>
                <div className="portfolio-tags">
                  {item.technologies.split(',').slice(0, 3).map((tech, idx) => (
                    <span className="tag" key={idx}>{tech.trim()}</span>
                  ))}
                </div>
                <p className="portfolio-card-desc">{item.description}</p>
                <div className="portfolio-card-actions">
                  <button className="btn-icon" onClick={() => handleOpenDetail(item)} title="Voir les détails">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button className="btn-icon" onClick={() => handleOpenForm(item)} title="Modifier">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className="btn-icon delete" style={{ marginLeft: 'auto' }} onClick={(e) => handleDelete(item.id, e)} title="Supprimer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFormModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{currentPortfolio ? 'Modifier le Projet' : 'Nouveau Projet'}</h2>
              <button className="btn-close" onClick={() => setIsFormModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label className="form-label">Titre du projet <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" className="form-input" name="titre" value={formData.titre} onChange={handleChange} required placeholder="Ex: Plateforme E-commerce Moderne" />
              </div>

              <div className="form-group">
                <label className="form-label">Image principale {!currentPortfolio && <span style={{color: '#ef4444'}}>*</span>}</label>
                <div className="image-upload-wrapper">
                  {(imagePreview || (currentPortfolio && currentPortfolio.image_principale)) && (
                    <img src={imagePreview || currentPortfolio.image_principale} alt="Aperçu" className="image-upload-preview" />
                  )}
                  <input type="file" className="form-input" name="image_principale" accept="image/*" onChange={handleImageChange} required={!currentPortfolio} style={{ background: 'transparent', border: 'none', padding: 0 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Catégorie</label>
                  <select className="form-input" name="categorie" value={formData.categorie} onChange={handleChange}>
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date de réalisation <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="date" className="form-input" name="date_realisation" value={formData.date_realisation} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Technologies (séparées par des virgules) <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" className="form-input" name="technologies" value={formData.technologies} onChange={handleChange} required placeholder="Ex: React, Node.js" />
                </div>
                <div className="form-group">
                  <label className="form-label">Lien du projet (URL)</label>
                  <input type="url" className="form-input" name="lien_projet" value={formData.lien_projet} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description détaillée <span style={{color: '#ef4444'}}>*</span></label>
                <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} required placeholder="Décrivez les objectifs, les défis et les résultats..."></textarea>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', background: '#f8fafc', padding: '1.5rem', borderRadius: 12, border: '1px solid #e2e8f0', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexGrow: 1 }}>
                  <input type="checkbox" id="est_actif" name="est_actif" checked={formData.est_actif} onChange={handleChange} style={{ width: 20, height: 20, cursor: 'pointer', accentColor: '#3b82f6' }} />
                  <label htmlFor="est_actif" style={{ fontWeight: 600, cursor: 'pointer', color: '#0f172a' }}>Projet actif (visible au public)</label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <label htmlFor="ordre_affichage" style={{ fontWeight: 600, color: '#0f172a' }}>Ordre :</label>
                  <input type="number" id="ordre_affichage" name="ordre_affichage" value={formData.ordre_affichage} onChange={handleChange} style={{ width: 70, padding: '8px', borderRadius: 8, border: '1.5px solid #cbd5e1', textAlign: 'center', fontWeight: 'bold' }} />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsFormModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && currentPortfolio && (
        <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Détails du Projet</h2>
              <button className="btn-close" onClick={() => setIsDetailModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <img src={currentPortfolio.image_principale || 'https://via.placeholder.com/800x600?text=No+Image'} alt={currentPortfolio.titre} className="detail-hero" />
              
              <h1 style={{ marginTop: 0, marginBottom: '0.5rem', color: '#0f172a' }}>
                {currentPortfolio.titre}
                {!currentPortfolio.est_actif && <span style={{marginLeft: 12, fontSize: 14, background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 4, verticalAlign: 'middle'}}>Inactif</span>}
              </h1>
              
              <div className="portfolio-tags" style={{ marginBottom: '1.5rem' }}>
                {currentPortfolio.technologies.split(',').map((tech, idx) => (
                  <span className="tag" key={idx}>{tech.trim()}</span>
                ))}
              </div>

              <div className="detail-info">
                <div className="info-item">
                  <span className="info-label">Catégorie</span>
                  <span className="info-value">{currentPortfolio.categorie?.nom || 'Non spécifié'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date de réalisation</span>
                  <span className="info-value">{currentPortfolio.date_realisation ? new Date(currentPortfolio.date_realisation).toLocaleDateString('fr-FR') : 'Non spécifiée'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Lien direct</span>
                  <span className="info-value">
                    {currentPortfolio.lien_projet ? (
                      <a href={currentPortfolio.lien_projet} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>Visiter le site ↗</a>
                    ) : 'Non disponible'}
                  </span>
                </div>
              </div>

              <h3 style={{ color: '#0f172a', marginBottom: '0.5rem' }}>Description du Projet</h3>
              <p className="detail-desc">{currentPortfolio.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PortfolioPage;
