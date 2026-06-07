import React, { useState, useEffect } from 'react';
import './carnetAdress.css';
import { getContacts, createContact, updateContact, deleteContact as deleteContactApi } from '../../services/authService';

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, type: '', data: null });

  // --- LOGIQUE CRUD ---
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const save = async () => {
      try {
        if (modal.type === 'edit') {
          await updateContact(modal.data.id, data);
        } else {
          await createContact(data);
        }
        await fetchContacts();
        setModal({ isOpen: false, type: '', data: null });
      } catch (err) {
        console.error(err);
        setError('Erreur lors de l\'enregistrement');
      }
    };

    save();
  };

  const handleDelete = (id) => {
    if (window.confirm("Supprimer ce contact ?")) {
      deleteContactApi(id).then(() => fetchContacts()).catch(err => {
        console.error(err);
        setError('Erreur lors de la suppression');
      });
    }
  };

  // Récupère les contacts depuis l'API
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getContacts();
      setContacts(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filtrage pour la recherche
  const filteredContacts = contacts.filter(c => 
    c.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="crm-container">
      {/* HEADER & RECHERCHE */}
      <div className="crm-header">
        <div>
          <h2>Gestion des <span>Contacts</span></h2>
          <p>{contacts.length} contact(s) enregistrés</p>
          {loading && <p className="small">Chargement...</p>}
          {error && <p className="small error">{error}</p>}
        </div>
        <div className="crm-actions">
          <input 
            type="text" 
            placeholder="Rechercher un nom ou email..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-add" onClick={() => setModal({ isOpen: true, type: 'add', data: {nom:'', email:'', numero_de_telephone:''} })}>
            + Nouveau Contact
          </button>
        </div>
      </div>

      {/* TABLEAU DES CONTACTS */}
      <div className="crm-table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(c => (
              <tr key={c.id}>
                <td className="col-nom">{c.nom || "N/A"}</td>
                <td>{c.email}</td>
                <td>{c.numero_de_telephone || "N/A"}</td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</td>
                <td className="td-actions">
                  <button className="btn-icon view" title="Détails" onClick={() => setModal({ isOpen: true, type: 'detail', data: c })}>👁️</button>
                  <button className="btn-icon edit" title="Modifier" onClick={() => setModal({ isOpen: true, type: 'edit', data: c })}>✏️</button>
                  <button className="btn-icon delete" title="Supprimer" onClick={() => handleDelete(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODALE DYNAMIQUE (Détail / Ajout / Edit) */}
      {modal.isOpen && (
        <div className="crm-overlay" onClick={() => setModal({ isOpen: false, type: '', data: null })}>
          <div className="crm-modal" onClick={e => e.stopPropagation()}>
            <button className="close-x" onClick={() => setModal({ isOpen: false, type: '', data: null })}>&times;</button>
            
            <h3>
              {modal.type === 'detail' && "Détails du Contact"}
              {modal.type === 'add' && "Ajouter un Contact"}
              {modal.type === 'edit' && "Modifier le Contact"}
            </h3>

            {modal.type === 'detail' ? (
              <div className="detail-view">
                <div className="detail-row"><label>Nom complet:</label> <span>{modal.data.nom}</span></div>
                <div className="detail-row"><label>Email:</label> <span>{modal.data.email}</span></div>
                <div className="detail-row"><label>Téléphone:</label> <span>{modal.data.numero_de_telephone}</span></div>
                <div className="detail-row"><label>Inscrit le:</label> <span>{new Date(modal.data.created_at).toLocaleString()}</span></div>
              </div>
            ) : (
              <form onSubmit={handleSave} className="crm-form">
                <div className="form-group">
                  <label>Nom Complet</label>
                  <input name="nom" defaultValue={modal.data?.nom} placeholder="Ex: Jean Paul" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" defaultValue={modal.data?.email} required placeholder="email@exemple.com" />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input name="numero_de_telephone" defaultValue={modal.data?.numero_de_telephone} placeholder="+228 00 00 00 00" />
                </div>
                <button type="submit" className="btn-submit">
                  {modal.type === 'edit' ? "Mettre à jour" : "Enregistrer"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}