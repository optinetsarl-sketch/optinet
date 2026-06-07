import React, { useState, useEffect } from 'react';
import { getPhotos } from '../../services/authService';
import './Galerie.css';

const API_URL = 'http://127.0.0.1:8000/api';

const getPhotoUrl = (photoPath) => {
  if (!photoPath) return '';
  if (photoPath.startsWith('http')) return photoPath;
  const normalizedPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
  return `${API_URL}${normalizedPath}`;
};

export default function Galerie() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await getPhotos();
      // On ne garde que les photos actives (est_actif === true)
      const activePhotos = response.data.filter(p => p.est_actif);
      setPhotos(activePhotos);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des photos:", error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Chargement de la galerie...</div>;

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <div className="section-tag">Portfolio</div>
        <h2 className="section-title">Nos Réalisations en <span className="accent">Direct</span></h2>
      </div>

      <div className="photos-grid">
        {photos.map(photo => (
          <div 
            key={photo.id} 
            className="photo-card" 
            onClick={() => setSelectedImg(photo)}
          >
            {/* Django DRF renvoie souvent l'URL complète, sinon on l'ajoute */}
            <img 
              src={getPhotoUrl(photo.image_principale)} 
              alt={photo.titre || 'Image de la galerie'} 
            />
            <div className="photo-overlay">
              <h4>{photo.titre || "Projet Optinet"}</h4>
              <span className="photo-date">
                {new Date(photo.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {selectedImg && (
        <div className="lightbox" onClick={() => setSelectedImg(null)}>
          <button className="close-lightbox">&times;</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img 
              src={getPhotoUrl(selectedImg.image_principale)} 
              alt={selectedImg.titre || 'Image sélectionnée'} 
            />
            <div className="lightbox-caption">
              <h3>{selectedImg.titre}</h3>
              <p>Réalisé le {new Date(selectedImg.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}