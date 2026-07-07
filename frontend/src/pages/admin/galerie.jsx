import React, { useState, useEffect } from 'react';
import {
  getProduits, getProduitDetail, createProduit, updateProduit,
  deleteProduit, addProduitPhoto, deleteProduitPhoto,
} from '../../services/authService';
import './galerie.css';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

const EMPTY = { id: null, nom: '', prix: '', description: '', caracteristiques: '', est_actif: true };

export default function AdminProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(EMPTY);
  const [files, setFiles] = useState([]);          // nouveaux fichiers à envoyer
  const [previews, setPreviews] = useState([]);    // aperçus locaux
  const [existingPhotos, setExistingPhotos] = useState([]); // photos déjà en base (édition)
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProduits(); }, []);

  const fetchProduits = async () => {
    setLoading(true);
    try {
      const res = await getProduits();
      setProduits(res.data || []);
    } catch (err) {
      console.error('Erreur chargement produits:', err);
      setError('Impossible de charger les produits.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrent(EMPTY);
    setFiles([]);
    setPreviews([]);
    setExistingPhotos([]);
    setError('');
  };

  const handleFiles = (e) => {
    const chosen = Array.from(e.target.files || []);
    setFiles((f) => [...f, ...chosen]);
    setPreviews((p) => [...p, ...chosen.map((file) => URL.createObjectURL(file))]);
  };

  const removeNewFile = (idx) => {
    setFiles((f) => f.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isEditing && files.length === 0) {
      setError('Ajoutez au moins une photo.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('nom', current.nom);
      fd.append('prix', current.prix || '');
      fd.append('description', current.description || '');
      fd.append('caracteristiques', current.caracteristiques || '');
      fd.append('est_actif', current.est_actif ? 'true' : 'false');
      files.forEach((file) => fd.append('images', file));

      if (isEditing && current.id) {
        await updateProduit(current.id, fd);
      } else {
        await createProduit(fd);
      }
      await fetchProduits();
      resetForm();
    } catch (err) {
      console.error('Erreur sauvegarde produit:', err);
      setError("Impossible d'enregistrer le produit.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = async (p) => {
    setError('');
    try {
      const res = await getProduitDetail(p.id);
      const d = res.data;
      setIsEditing(true);
      setCurrent({
        id: d.id, nom: d.nom || '', prix: d.prix || '',
        description: d.description || '', caracteristiques: d.caracteristiques || '',
        est_actif: d.est_actif,
      });
      setExistingPhotos(d.photos || []);
      setFiles([]); setPreviews([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Impossible de charger le produit.');
    }
  };

  const removeExistingPhoto = async (photoId) => {
    if (!window.confirm('Supprimer cette photo ?')) return;
    try {
      await deleteProduitPhoto(photoId);
      setExistingPhotos((ph) => ph.filter((x) => x.id !== photoId));
      await fetchProduits();
    } catch (err) {
      console.error(err);
      setError('Impossible de supprimer la photo.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit et toutes ses photos ?')) return;
    try {
      await deleteProduit(id);
      await fetchProduits();
      if (current.id === id) resetForm();
    } catch (err) {
      console.error(err);
      setError('Impossible de supprimer le produit.');
    }
  };

  const toggleActive = async (p) => {
    const fd = new FormData();
    fd.append('est_actif', p.est_actif ? 'false' : 'true');
    try {
      await updateProduit(p.id, fd);
      await fetchProduits();
    } catch (err) {
      console.error(err);
      setError('Impossible de changer le statut.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestion de la <span>Boutique</span></h2>
        <p>Créez un produit avec plusieurs photos, un prix, ses caractéristiques et une description</p>
      </div>

      <div className="admin-grid">
        <div className="admin-form-card">
          <h3>{isEditing ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
          {error && <p style={{ color: '#ff6b6b', marginBottom: 16 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom du produit</label>
              <input type="text" value={current.nom} required
                onChange={(e) => setCurrent({ ...current, nom: e.target.value })}
                placeholder="Ex: Samsung Galaxy A54 5G" />
            </div>

            <div className="form-group">
              <label>Prix</label>
              <input type="text" value={current.prix}
                onChange={(e) => setCurrent({ ...current, prix: e.target.value })}
                placeholder="Ex: 150 000 FCFA" />
            </div>

            <div className="form-group">
              <label>Caractéristiques (une par ligne, format « Nom: Valeur »)</label>
              <textarea rows={5} value={current.caracteristiques}
                onChange={(e) => setCurrent({ ...current, caracteristiques: e.target.value })}
                placeholder={"Modèle: Galaxy A54\nRéseau: 4G/5G\nBatterie: 5000 mAh\nCouleur: Noir"} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows={4} value={current.description}
                onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                placeholder="Décrivez le produit, son état, la garantie…" />
            </div>

            {/* photos déjà en base (édition) */}
            {isEditing && existingPhotos.length > 0 && (
              <div className="form-group">
                <label>Photos actuelles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {existingPhotos.map((ph) => (
                    <div key={ph.id} style={{ position: 'relative' }}>
                      <img src={httpsUrl(ph.image)} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                      <button type="button" onClick={() => removeExistingPhoto(ph.id)}
                        style={delBadge} title="Supprimer">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>{isEditing ? 'Ajouter des photos' : 'Photos (plusieurs possibles)'}</label>
              <input type="file" onChange={handleFiles} accept="image/*" multiple />
              {previews.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }} />
                      <button type="button" onClick={() => removeNewFile(i)} style={delBadge}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <small style={{ color: '#8fa3b8' }}>La 1ʳᵉ photo devient la photo principale.</small>
            </div>

            <div className="form-group checkbox">
              <input type="checkbox" checked={current.est_actif}
                onChange={(e) => setCurrent({ ...current, est_actif: e.target.checked })} />
              <label>Visible dans la boutique</label>
            </div>

            <div className="form-btns">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Enregistrement…' : (isEditing ? 'Mettre à jour' : 'Enregistrer le produit')}
              </button>
              {isEditing && (
                <button type="button" className="btn-cancel" onClick={resetForm}>Annuler</button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-card">
          <h3>Produits ({produits.length})</h3>
          {loading ? <p>Chargement...</p> : (
            <table className="admin-table">
              <thead>
                <tr><th>Photo</th><th>Nom</th><th>Prix</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {produits.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={httpsUrl(p.image_principale)} alt="" className="table-thumb" />
                      {p.nb_photos > 1 && <span style={{ fontSize: 11, color: '#8fa3b8' }}> 📷{p.nb_photos}</span>}
                    </td>
                    <td>{p.nom}</td>
                    <td>{p.prix || '—'}</td>
                    <td>
                      <span className={`status-pill ${p.est_actif ? 'active' : 'inactive'}`}>
                        {p.est_actif ? 'En ligne' : 'Masqué'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button className="btn-edit" onClick={() => startEdit(p)} title="Modifier">✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(p.id)} title="Supprimer">🗑️</button>
                      <button className="btn-edit" onClick={() => toggleActive(p)}>
                        {p.est_actif ? 'Masquer' : 'Afficher'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const delBadge = {
  position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%',
  border: 'none', background: '#ff4d4f', color: '#fff', cursor: 'pointer', fontSize: 13, lineHeight: '20px', padding: 0,
};
