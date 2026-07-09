import React, { useState, useEffect } from "react";
import "../styles_admin/users.css";
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from "../../services/authService";

const ROLES = [
  { value: "DG", label: "Directeur Général" },
  { value: "SG", label: "Secrétaire Général" },
  { value: "CD", label: "Chef Département" },
  { value: "CP", label: "Chef Projet" },
  { value: "DV", label: "Développeur" },
  { value: "UT", label: "Utilisateur" },
];
const roleLabel = (r) => (ROLES.find((x) => x.value === r) || {}).label || r || "—";
const roleBadgeClass = (r) => (r === "DG" || r === "SG" ? "admin" : "user");

const EMPTY_FORM = { id: null, first_name: "", last_name: "", email: "", password: "", role: "UT", telephone: "" };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return `${u.first_name || ""} ${u.last_name || ""} ${u.email || ""}`.toLowerCase().includes(s);
  });

  const openCreate = () => {
    setMode("create");
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setForm({
      id: u.id, first_name: u.first_name || "", last_name: u.last_name || "",
      email: u.email || "", password: "", role: u.role || "UT", telephone: u.telephone || "",
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.first_name.trim() || !form.email.trim()) {
      setError("Le prénom et l'email sont requis.");
      return;
    }
    if (mode === "create" && !form.password.trim()) {
      setError("Le mot de passe est requis.");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        await createUser({
          first_name: form.first_name, last_name: form.last_name, email: form.email,
          password: form.password, role: form.role, telephone: form.telephone,
        });
      } else {
        await updateUser(form.id, {
          first_name: form.first_name, last_name: form.last_name, email: form.email,
          role: form.role, telephone: form.telephone,
        });
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur enregistrement utilisateur:", err);
      const apiMsg = err.response?.data && JSON.stringify(err.response.data);
      setError(apiMsg || "Impossible d'enregistrer cet utilisateur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Supprimer ${u.first_name} ${u.last_name || ""} ?`)) return;
    try {
      await deleteUser(u.id);
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression utilisateur:", err);
      alert("Impossible de supprimer cet utilisateur.");
    }
  };

  const handleToggle = async (u) => {
    try {
      await toggleUserStatus(u.id);
      fetchUsers();
    } catch (err) {
      console.error("Erreur changement de statut:", err);
      alert("Impossible de changer le statut de cet utilisateur.");
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
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" className="search-input" placeholder="Rechercher un utilisateur..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="add-btn" onClick={openCreate}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
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
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{(user.first_name || "?").charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="user-name">{user.first_name} {user.last_name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${roleBadgeClass(user.role)}`}>
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td>{user.telephone || "-"}</td>
                <td>
                  <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
                    <span className="status-dot"></span>
                    {user.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn edit" title="Modifier" onClick={() => openEdit(user)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button className="action-btn block" title={user.is_active ? "Bloquer" : "Débloquer"} onClick={() => handleToggle(user)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </button>
                    <button className="action-btn delete" title="Supprimer" onClick={() => handleDelete(user)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p style={{ padding: 16 }}>Chargement des utilisateurs...</p>}
        {!loading && filtered.length === 0 && <p style={{ padding: 16, color: "#64748b" }}>Aucun utilisateur.</p>}
      </div>

      {modalOpen && (
        <div onClick={closeModal} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <h3 style={{ margin: "0 0 18px", color: "#0f4f7b" }}>
              {mode === "create" ? "Nouvel utilisateur" : "Modifier l'utilisateur"}
            </h3>
            {error && <p style={{ color: "#c0392b", marginBottom: 14, fontSize: 13.5 }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={rowStyle}>
                <input style={inputStyle} placeholder="Prénom *" value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                <input style={inputStyle} placeholder="Nom" value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
              </div>
              <input style={inputStyle} type="email" placeholder="Email *" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              {mode === "create" && (
                <input style={inputStyle} type="password" placeholder="Mot de passe *" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              )}
              <div style={rowStyle}>
                <select style={inputStyle} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <input style={inputStyle} placeholder="Téléphone" value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="submit" className="add-btn" disabled={saving} style={{ flex: 1, justifyContent: "center" }}>
                  {saving ? "Enregistrement…" : mode === "create" ? "Créer" : "Mettre à jour"}
                </button>
                <button type="button" onClick={closeModal} style={cancelBtnStyle}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const overlayStyle = {
  position: "fixed", inset: 0, background: "rgba(15,30,50,.45)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
};
const modalStyle = {
  background: "#fff", borderRadius: 16, padding: 28, width: 440, maxWidth: "100%",
  boxShadow: "0 20px 60px rgba(0,0,0,.25)",
};
const rowStyle = { display: "flex", gap: 10 };
const inputStyle = {
  flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid #cbd5e1",
  fontSize: 14, outline: "none", fontFamily: "inherit",
};
const cancelBtnStyle = {
  padding: "12px 20px", borderRadius: 10, border: "1px solid #cbd5e1",
  background: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer",
};

export default Users;
