import React, { useState, useEffect } from 'react';
import { getPhotos, createPhoto, updatePhoto, deletePhoto } from '../../services/authService';
import './galerie.css';

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState({ id: null, titre: '', est_actif: true, image: '', imageFile: null });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await getPhotos();
      setPhotos(response.data);
    } catch (err) {
      console.error('Erreur chargement photos:', err);
      setError('Impossible de charger les photos.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentPhoto({ id: null, titre: '', est_actif: true, image: '', imageFile: null });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('titre', currentPhoto.titre);
    formData.append('est_actif', currentPhoto.est_actif ? 'true' : 'false');
    if (currentPhoto.imageFile) {
      formData.append('image_principale', currentPhoto.imageFile);
    }

    try {
      if (isEditing && currentPhoto.id) {
        await updatePhoto(currentPhoto.id, formData);
      } else {
        await createPhoto(formData);
      }
      await fetchPhotos();
      resetForm();
    } catch (err) {
      console.error('Erreur sauvegarde photo:', err);
      setError('Impossible de sauvegarder la photo.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette photo ?')) return;
    try {
      await deletePhoto(id);
      await fetchPhotos();
    } catch (err) {
      console.error('Erreur suppression photo:', err);
      setError('Impossible de supprimer la photo.');
    }
  };

  const startEdit = (photo) => {
    setIsEditing(true);
    setCurrentPhoto({
      id: photo.id,
      titre: photo.titre || '',
      est_actif: photo.est_actif,
      image: photo.image_principale || photo.image || '',
      imageFile: null,
    });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentPhoto({ ...currentPhoto, imageFile: file, image: previewUrl });
    }
  };

  const toggleActive = async (photo) => {
    const formData = new FormData();
    formData.append('est_actif', photo.est_actif ? 'false' : 'true');

    try {
      await updatePhoto(photo.id, formData);
      await fetchPhotos();
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      setError('Impossible de changer le statut.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Gestion du <span>Portfolio</span></h2>
        <p>Ajoutez ou modifiez les photos de la galerie</p>
      </div>

      <div className="admin-grid">
        <div className="admin-form-card">
          <h3>{isEditing ? 'Modifier la photo' : 'Ajouter une photo'}</h3>
          {error && <p style={{ color: '#ff6b6b', marginBottom: 16 }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Titre de la photo</label>
              <input
                type="text"
                value={currentPhoto.titre}
                onChange={(e) => setCurrentPhoto({ ...currentPhoto, titre: e.target.value })}
                required
                placeholder="Ex: Baie de brassage..."
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <input type="file" onChange={handleImageChange} accept="image/*" />
              {currentPhoto.image && <img src={currentPhoto.image} alt="Preview" className="preview-img" />}
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                checked={currentPhoto.est_actif}
                onChange={(e) => setCurrentPhoto({ ...currentPhoto, est_actif: e.target.checked })}
              />
              <label>Rendre visible sur le site</label>
            </div>

            <div className="form-btns">
              <button type="submit" className="btn-save">
                {isEditing ? 'Mettre à jour' : 'Enregistrer la photo'}
              </button>
              {isEditing && (
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="admin-list-card">
          <h3>Photos existantes</h3>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Aperçu</th>
                  <th>Titre</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((photo) => (
                  <tr key={photo.id}>
                    <td>
                      <img src={photo.image_principale || photo.image} alt="" className="table-thumb" />
                    </td>
                    <td>{photo.titre}</td>
                    <td>
                      <span className={`status-pill ${photo.est_actif ? 'active' : 'inactive'}`}>
                        {photo.est_actif ? 'En ligne' : 'Masquée'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button className="btn-edit" onClick={() => startEdit(photo)}>
                        ✏️
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(photo.id)}>
                        🗑️
                      </button>
                      <button className="btn-edit" onClick={() => toggleActive(photo)}>
                        {photo.est_actif ? 'Désactiver' : 'Activer'}
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
