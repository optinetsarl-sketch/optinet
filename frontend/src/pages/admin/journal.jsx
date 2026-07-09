import React, { useState, useEffect } from 'react';
import {
  getActualites, getActualiteDetail, createActualite, updateActualite,
  deleteActualite, addActualitePhoto, deleteActualitePhoto,
} from '../../services/authService';
import './galerie.css';

const httpsUrl = (u) => {
  if (!u) return '';
  if (/^https?:\/\/(127\.0\.0\.1|localhost)/i.test(u)) return u;
  return u.replace(/^http:\/\//, 'https://');
};

const CATEGORIES = [
  { value: 'intervention', label: 'Intervention terrain' },
  { value: 'realisation', label: 'Réalisation' },
  { value: 'actualite', label: 'Actualité' },
  { value: 'annonce', label: 'Annonce & Info' },
];
const SERVICES = [
  { value: '', label: '— Aucun —' },
  { value: 'reseaux', label: 'Réseaux & Infrastructure' },
  { value: 'securite', label: 'Sécurité & Surveillance' },
  { value: 'fibre', label: 'Fibre Optique & Télécoms' },
  { value: 'serveurs', label: 'Serveurs & Virtualisation' },
  { value: 'telephonie', label: "Téléphonie d'Entreprise" },
  { value: 'conseil', label: 'Conseil & Formation' },
  { value: 'developpement', label: 'Développement & Applications' },
];

const EMPTY = { id: null, titre: '', contenu: '', categorie: 'intervention', service: '', video_url: '', est_publie: true };

export default function AdminJournal() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await getActualites();
      setItems(res.data || []);
    } catch (err) {
      console.error('Erreur chargement Journal:', err);
      setError('Impossible de charger les publications.');
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
      fd.append('titre', current.titre);
      fd.append('contenu', current.contenu || '');
      fd.append('categorie', current.categorie);
      fd.append('service', current.service || '');
      fd.append('video_url', current.video_url || '');
      fd.append('est_publie', current.est_publie ? 'true' : 'false');
      files.forEach((file) => fd.append('images', file));

      if (isEditing && current.id) {
        await updateActualite(current.id, fd);
      } else {
        await createActualite(fd);
      }
      await fetchItems();
      resetForm();
    } catch (err) {
      console.error('Erreur sauvegarde publication:', err);
      setError("Impossible d'enregistrer la publication.");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = async (a) => {
    setError('');
    try {
      const res = await getActualiteDetail(a.id);
      const d = res.data;
      setIsEditing(true);
      setCurrent({
        id: d.id, titre: d.titre || '', contenu: d.contenu || '',
        categorie: d.categorie || 'intervention', service: d.service || '',
        video_url: d.video_url || '', est_publie: d.est_publie,
      });
      setExistingPhotos(d.photos || []);
      setFiles([]); setPreviews([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la publication.');
    }
  };

  const removeExistingPhoto = async (photoId) => {
    if (!window.confirm('Supprimer cette photo ?')) return;
    try {
      await deleteActualitePhoto(photoId);
      setExistingPhotos((ph) => ph.filter((x) => x.id !== photoId));
      await fetchItems();
    } catch (err) {
      console.error(err);
      setError('Impossible de supprimer la photo.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette publication et toutes ses photos ?')) return;
    try {
      await deleteActualite(id);
      await fetchItems();
      if (current.id === id) resetForm();
    } catch (err) {
      console.error(err);
      setError('Impossible de supprimer la publication.');
    }
  };

  const togglePublie = async (a) => {
    const fd = new FormData();
    fd.append('est_publie', a.est_publie ? 'false' : 'true');
    try {
      await updateActualite(a.id, fd);
      await fetchItems();
    } catch (err) {
      console.error(err);
      setError('Impossible de changer le statut.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestion du <span>Journal</span></h2>
        <p>Modifiez ou supprimez les interventions, réalisations, actualités et annonces publiées</p>
      </div>

      <div className="admin-grid">
        <div className="admin-form-card">
          <h3>{isEditing ? 'Modifier la publication' : 'Ajouter une publication'}</h3>
          {error && <p style={{ color: '#ff6b6b', marginBottom: 16 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titre</label>
              <input type="text" value={current.titre} required
                onChange={(e) => setCurrent({ ...current, titre: e.target.value })}
                placeholder="Ex: Déploiement fibre optique — siège CNSS Lomé" />
            </div>

            <div className="form-group">
              <label>Récit</label>
              <textarea rows={5} value={current.contenu}
                onChange={(e) => setCurrent({ ...current, contenu: e.target.value })}
                placeholder="Racontez l'intervention…" />
            </div>

            <div className="form-group">
              <label>Catégorie</label>
              <select value={current.categorie}
                onChange={(e) => setCurrent({ ...current, categorie: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Service concerné</label>
              <select value={current.service}
                onChange={(e) => setCurrent({ ...current, service: e.target.value })}>
                {SERVICES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Lien vidéo YouTube (facultatif)</label>
              <input type="text" value={current.video_url}
                onChange={(e) => setCurrent({ ...current, video_url: e.target.value })}
                placeholder="https://youtu.be/..." />
            </div>

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
              <small style={{ color: '#8fa3b8' }}>La 1ʳᵉ photo devient la photo de couverture.</small>
            </div>

            <div className="form-group checkbox">
              <input type="checkbox" checked={current.est_publie}
                onChange={(e) => setCurrent({ ...current, est_publie: e.target.checked })} />
              <label>Publié sur le site</label>
            </div>

            <div className="form-btns">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Enregistrement…' : (isEditing ? 'Mettre à jour' : 'Publier')}
              </button>
              {isEditing && (
                <button type="button" className="btn-cancel" onClick={resetForm}>Annuler</button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-card">
          <h3>Publications ({items.length})</h3>
          {loading ? <p>Chargement...</p> : (
            <table className="admin-table">
              <thead>
                <tr><th>Photo</th><th>Titre</th><th>Catégorie</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <img src={httpsUrl(a.image_principale)} alt="" className="table-thumb" />
                      {a.nb_photos > 1 && <span style={{ fontSize: 11, color: '#8fa3b8' }}> 📷{a.nb_photos}</span>}
                    </td>
                    <td>{a.titre}</td>
                    <td>{a.categorie_label}</td>
                    <td>
                      <span className={`status-pill ${a.est_publie ? 'active' : 'inactive'}`}>
                        {a.est_publie ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button className="btn-edit" onClick={() => startEdit(a)} title="Modifier">✏️</button>
                      <button className="btn-delete" onClick={() => handleDelete(a.id)} title="Supprimer">🗑️</button>
                      <button className="btn-edit" onClick={() => togglePublie(a)}>
                        {a.est_publie ? 'Dépublier' : 'Publier'}
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
