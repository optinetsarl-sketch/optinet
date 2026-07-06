import React, { useState, useEffect } from "react";
import "../styles_admin/users.css";
import { getUsers, toggleUserStatus, deleteUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleView = (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleAddUser = () => {
    navigate('/admin/users/create');
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleToggle = async (id) => {
    try {
      await toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
      );
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes‑vous sûr de vouloir supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h1 className="users-title">Liste des Utilisateurs</h1>
          <p className="users-subtitle">Gérez les accès et les informations de vos utilisateurs.</p>
        </div>
        <div className="users-actions">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="text" className="search-input" placeholder="Rechercher un utilisateur..." />
          </div>
          <button className="add-btn" onClick={handleAddUser}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      <div className="table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.avatar}</div>
                    <div>
                      <div className="user-name">{user.username}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td><span className={`role-badge ${user.role.toLowerCase()}`}>{user.role}</span></td>
                <td>{user.telephone || "-"}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
                    <span className="status-dot" />
                    {user.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td>
            <div className="actions-cell">
              <button className="action-btn view" title="Afficher" onClick={() => handleView(user.id)}>View</button>
              <button className="action-btn edit" title="Modifier" onClick={() => handleEdit(user.id)}>Edit</button>
              <button className="action-btn block" title={user.is_active ? "Bloquer" : "Débloquer"} onClick={() => handleToggle(user.id)}>{user.is_active ? "Block" : "Unblock"}</button>
              <button className="action-btn delete" title="Supprimer" onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Chargement des utilisateurs...</p>}
      </div>
    </div>
  );
};

export default Users;