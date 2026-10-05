import React, { useState, useEffect } from "react";
import "../styles_admin/users.css";
import { getUsers, createUser, updateUser, deleteUser, toggleUserStatus } from "../../services/authService";

const ROLES = [
  { value: "DG", label: "Directeur Général", category: "admin" },
  { value: "SG", label: "Secrétaire Général", category: "admin" },
  { value: "CD", label: "Chef Département", category: "admin" },
  { value: "CP", label: "Chef Projet", category: "tech" },
  { value: "DV", label: "Développeur", category: "tech" },
  { value: "UT", label: "Utilisateur Standard", category: "user" },
];

const roleLabel = (r) => (ROLES.find((x) => x.value === r) || {}).label || r || "Utilisateur";

const roleBadgeClass = (r) => {
  if (r === "DG" || r === "SG") return "role-badge--director";
  if (r === "CD" || r === "CP") return "role-badge--lead";
  if (r === "DV") return "role-badge--dev";
  return "role-badge--user";
};

const EMPTY_FORM = { id: null, first_name: "", last_name: "", email: "", password: "", role: "UT", telephone: "" };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // 'all' | 'active' | 'inactive' | 'admin' | 'tech'
  
  // Modale création/édition
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // 'create' | 'edit'
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modale confirmation suppression
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null, loading: false });

  // Toast feedback
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((response) => setUsers(response.data || []))
      .catch((error) => {
        console.error("Failed to fetch users:", error);
        showToast("Erreur de chargement des utilisateurs", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  // Filtrage combiné (Recherche + Onglets)
  const filtered = users.filter((u) => {
    // Filtre texte
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      const match = `${u.first_name || ""} ${u.last_name || ""} ${u.email || ""} ${u.telephone || ""}`.toLowerCase().includes(s);
      if (!match) return false;
    }

    // Filtre onglet
    if (tabFilter === "active") return u.is_active !== false;
    if (tabFilter === "inactive") return u.is_active === false;
    if (tabFilter === "admin") return ["DG", "SG", "CD"].includes(u.role);
    if (tabFilter === "tech") return ["CP", "DV"].includes(u.role);
    return true;
  });

  // KPI calculés
  const countTotal = users.length;
  const countActive = users.filter((u) => u.is_active !== false).length;
  const countInactive = users.filter((u) => u.is_active === false).length;
  const countAdmins = users.filter((u) => ["DG", "SG", "CD"].includes(u.role)).length;

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

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.first_name.trim() || !form.email.trim()) {
      setError("Le prénom et l'adresse email sont obligatoires.");
      return;
    }
    if (mode === "create" && !form.password.trim()) {
      setError("Le mot de passe initial est requis.");
      return;
    }

    setSaving(true);
    try {
      if (mode === "create") {
        await createUser({
          first_name: form.first_name, last_name: form.last_name, email: form.email,
          password: form.password, role: form.role, telephone: form.telephone,
        });
        showToast("Utilisateur créé avec succès !");
      } else {
        await updateUser(form.id, {
          first_name: form.first_name, last_name: form.last_name, email: form.email,
          role: form.role, telephone: form.telephone,
        });
        showToast("Utilisateur mis à jour avec succès !");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Erreur enregistrement utilisateur:", err);
      const apiMsg = err.response?.data && (err.response.data.detail || JSON.stringify(err.response.data));
      setError(apiMsg || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (u) => {
    setDeleteModal({ open: true, user: u, loading: false });
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;
    setDeleteModal((prev) => ({ ...prev, loading: true }));
    try {
      await deleteUser(deleteModal.user.id);
      showToast("Compte utilisateur supprimé.");
      setDeleteModal({ open: false, user: null, loading: false });
      fetchUsers();
    } catch (err) {
      console.error("Erreur suppression:", err);
      showToast("Impossible de supprimer cet utilisateur", "error");
      setDeleteModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleToggle = async (u) => {
    try {
      await toggleUserStatus(u.id);
      showToast(u.is_active ? "Compte utilisateur suspendu" : "Compte utilisateur activé");
      fetchUsers();
    } catch (err) {
      console.error("Erreur toggle statut:", err);
      showToast("Impossible de modifier le statut", "error");
    }
  };

  return (
    <div className="users-page">

      {/* ── Toast Notification ── */}
      {toast.show && (
        <div className={`toast-notification toast-notification--${toast.type}`}>
          <div className="toast-icon">
            {toast.type === "success" ? "✓" : "!"}
          </div>
          <div className="toast-message">{toast.message}</div>
        </div>
      )}

      {/* ── En-tête de page ── */}
      <div className="users-header">
        <div>
          <h1 className="users-title">Gestion des Utilisateurs</h1>
          <p className="users-subtitle">Administrez les rôles, permissions et statuts d'accès de votre équipe.</p>
        </div>

        <div className="users-header-actions">
          <button className="refresh-btn" onClick={fetchUsers} title="Actualiser la liste">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span>Actualiser</span>
          </button>
          <button className="add-btn" onClick={openCreate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Nouvel Utilisateur</span>
          </button>
        </div>
      </div>

      {/* ── Cartes Récapitulatives (KPI) ── */}
      <div className="users-kpi-grid">
        <div className="user-kpi-card" onClick={() => setTabFilter("all")}>
          <div className="user-kpi-val">{countTotal}</div>
          <div className="user-kpi-label">Total Comptes</div>
        </div>
        <div className="user-kpi-card user-kpi-card--green" onClick={() => setTabFilter("active")}>
          <div className="user-kpi-val">{countActive}</div>
          <div className="user-kpi-label">Comptes Actifs</div>
        </div>
        <div className="user-kpi-card user-kpi-card--amber" onClick={() => setTabFilter("inactive")}>
          <div className="user-kpi-val">{countInactive}</div>
          <div className="user-kpi-label">Inactifs / Bloqués</div>
        </div>
        <div className="user-kpi-card user-kpi-card--purple" onClick={() => setTabFilter("admin")}>
          <div className="user-kpi-val">{countAdmins}</div>
          <div className="user-kpi-label">Administrateurs</div>
        </div>
      </div>

      {/* ── Barre de Contrôle : Filtres & Recherche ── */}
      <div className="users-controls-card">
        <div className="users-tabs">
          <button
            className={`users-tab${tabFilter === "all" ? " users-tab--active" : ""}`}
            onClick={() => setTabFilter("all")}
          >
            Tous ({countTotal})
          </button>
          <button
            className={`users-tab${tabFilter === "active" ? " users-tab--active" : ""}`}
            onClick={() => setTabFilter("active")}
          >
            Actifs ({countActive})
          </button>
          <button
            className={`users-tab${tabFilter === "inactive" ? " users-tab--active" : ""}`}
            onClick={() => setTabFilter("inactive")}
          >
            Inactifs ({countInactive})
          </button>
          <button
            className={`users-tab${tabFilter === "admin" ? " users-tab--active" : ""}`}
            onClick={() => setTabFilter("admin")}
          >
            Direction & Chefs ({countAdmins})
          </button>
          <button
            className={`users-tab${tabFilter === "tech" ? " users-tab--active" : ""}`}
            onClick={() => setTabFilter("tech")}
          >
            Équipe Tech
          </button>
        </div>

        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par nom, email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search-btn" onClick={() => setSearch("")}>×</button>
          )}
        </div>
      </div>

      {/* ── Table des Utilisateurs ── */}
      <div className="table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle & Niveau</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className={!user.is_active ? "row--inactive" : ""}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {(user.first_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="user-id-badge">ID #{user.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="user-email-text">{user.email}</span>
                </td>
                <td>
                  <span className={`role-badge ${roleBadgeClass(user.role)}`}>
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span className="user-phone-text">{user.telephone || "—"}</span>
                </td>
                <td>
                  <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
                    <span className="status-dot"></span>
                    {user.is_active ? "Actif" : "Bloqué"}
                  </span>
                </td>
                <td>
                  <div className="actions-cell" style={{ justifyContent: "flex-end" }}>
                    <button
                      className="action-btn edit"
                      title="Modifier les informations"
                      onClick={() => openEdit(user)}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    <button
                      className={`action-btn ${user.is_active ? "block" : "unblock"}`}
                      title={user.is_active ? "Suspendre l'accès" : "Réactiver le compte"}
                      onClick={() => handleToggle(user)}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </button>
                    <button
                      className="action-btn delete"
                      title="Supprimer définitivement"
                      onClick={() => openDeleteModal(user)}
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {loading && (
          <div className="table-state-box">
            <div className="spinner" />
            <span>Chargement des utilisateurs en cours…</span>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="table-state-box">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            <p>Aucun utilisateur ne correspond à votre filtre.</p>
          </div>
        )}
      </div>

      {/* ── MODALE CRÉATION / ÉDITION CONVIVIALE ── */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sheet__head">
              <div>
                <h3 className="modal-sheet__title">
                  {mode === "create" ? "Ajouter un Collaborateur" : "Modifier le Compte"}
                </h3>
                <p className="modal-sheet__desc">
                  {mode === "create" ? "Renseignez les détails du nouvel utilisateur" : `Mise à jour du profil de ${form.first_name}`}
                </p>
              </div>
              <button className="modal-sheet__close" onClick={closeModal}>×</button>
            </div>

            {error && <div className="modal-sheet__error">{error}</div>}

            <form onSubmit={handleSubmit} className="modal-sheet__form">
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    placeholder="Ex: Jean"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Nom de famille</label>
                  <input
                    type="text"
                    placeholder="Ex: Dupont"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Adresse Email *</label>
                <input
                  type="email"
                  placeholder="collaborateur@optinet.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              {mode === "create" && (
                <div className="form-field">
                  <label>Mot de passe initial *</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <span className="field-hint">Minimum 6 caractères</span>
                </div>
              )}

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Rôle & Attribution</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Numéro Téléphone</label>
                  <input
                    type="tel"
                    placeholder="+228 90 00 00 00"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-sheet__actions">
                <button type="button" className="btn-cancel" onClick={closeModal} disabled={saving}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? (
                    <span className="btn-loader-text">Enregistrement…</span>
                  ) : mode === "create" ? "Créer le compte" : "Sauvegarder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE CONFIRMATION SUPPRESSION ── */}
      {deleteModal.open && (
        <div className="modal-backdrop" onClick={() => setDeleteModal({ open: false, user: null, loading: false })}>
          <div className="modal-sheet modal-sheet--danger" onClick={(e) => e.stopPropagation()}>
            <div className="danger-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 className="modal-sheet__title" style={{ textAlign: "center", marginTop: 8 }}>
              Supprimer cet utilisateur ?
            </h3>
            <p className="modal-sheet__desc" style={{ textAlign: "center" }}>
              Êtes-vous sûr de vouloir supprimer le compte de <strong>{deleteModal.user?.first_name} {deleteModal.user?.last_name}</strong> ({deleteModal.user?.email}) ? Cette action est irréversible.
            </p>
            <div className="modal-sheet__actions" style={{ justifyContent: "center", marginTop: 20 }}>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setDeleteModal({ open: false, user: null, loading: false })}
                disabled={deleteModal.loading}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleteModal.loading}
              >
                {deleteModal.loading ? "Suppression…" : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
