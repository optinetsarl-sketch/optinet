// import React, { useEffect, useState, useMemo } from "react";
// import "../../styles/Users.css";
// import { getUsers, toggleUserStatus, adminResetPassword } from "../../services/authService";
// import { useNavigate } from "react-router-dom";

// // ─── Icônes SVG inline ──────────────────────────────────────────
// const Icons = {
//   search: (
//     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
//     </svg>
//   ),
//   plus: (
//     <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
//       <path d="M12 5v14M5 12h14" />
//     </svg>
//   ),
//   users: (
//     <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
//     </svg>
//   ),
//   active: (
//     <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//     </svg>
//   ),
//   inactive: (
//     <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
//     </svg>
//   ),
//   admin: (
//     <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
//       <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
//     </svg>
//   ),
//   lock: (
//     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
//       <path d="M7 11V7a5 5 0 0110 0v4" />
//     </svg>
//   ),
//   power: (
//     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <path d="M18.36 6.64a9 9 0 11-12.73 0M12 2v10" />
//     </svg>
//   ),
//   empty: (
//     <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" opacity="0.3">
//       <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
//       <circle cx="9" cy="7" r="4" />
//       <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//     </svg>
//   ),
// };

// // ─── Squelette de chargement ─────────────────────────────────────
// const TableSkeleton = ({ rows = 5 }) => (
//   <table className="users-table">
//     <thead>
//       <tr>
//         {["Utilisateur", "Email", "Nom", "Prénom", "Client", "Schéma", "Domaine", "Statut", "Rôle", "Inscription", "Actions"].map((h, i) => (
//           <th key={i}>{h}</th>
//         ))}
//       </tr>
//     </thead>
//     <tbody>
//       {Array.from({ length: rows }).map((_, i) => (
//         <tr key={i} className="skeleton-row">
//           {Array.from({ length: 11 }).map((_, j) => (
//             <td key={j}><span className="skeleton-line" style={{ width: `${60 + Math.random() * 30}%` }} /></td>
//           ))}
//         </tr>
//       ))}
//     </tbody>
//   </table>
// );

// // ─── État vide ────────────────────────────────────────────────────
// const EmptyState = ({ onAdd }) => (
//   <div className="empty-state">
//     {Icons.empty}
//     <h2>Aucun utilisateur trouvé</h2>
//     <p>Commencez par ajouter votre premier utilisateur à la plateforme.</p>
//     <button className="add-btn" onClick={onAdd}>
//       {Icons.plus} Ajouter un utilisateur
//     </button>
//   </div>
// );

// // ─── Toast notification simple ────────────────────────────────────
// const Toast = ({ message, type, onClose }) => {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3500);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <div className={`toast toast-${type}`} onClick={onClose}>
//       {message}
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════
// // COMPOSANT PRINCIPAL
// // ═══════════════════════════════════════════════════════════════════
// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filterRole, setFilterRole] = useState("all");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [toast, setToast] = useState(null);
//   const navigate = useNavigate();

//   // ─── Récupération des données ──────────────────────────────────
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await getUsers();
//       setUsers(response.data);
//     } catch (error) {
//       console.error(error);
//       showToast("Impossible de charger les utilisateurs.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   // ─── Toast ─────────────────────────────────────────────────────
//   const showToast = (message, type = "success") => setToast({ message, type });

//   // ─── Toggle statut ─────────────────────────────────────────────
//   const handleToggleStatus = async (userId) => {
//     try {
//       const response = await toggleUserStatus(userId);
//       if (response.status === 200) {
//         setUsers(users.map(u => u.id === userId ? { ...u, is_active: response.data.is_active } : u));
//         showToast(`Utilisateur ${response.data.is_active ? "activé" : "désactivé"} avec succès.`);
//       }
//     } catch {
//       showToast("Erreur lors du changement de statut.", "error");
//     }
//   };

//   // ─── Reset mot de passe ────────────────────────────────────────
//   const handleResetPassword = async (userId) => {
//     const newPassword = prompt("Entrez le nouveau mot de passe pour cet utilisateur :");
//     if (!newPassword) return;
//     try {
//       const response = await adminResetPassword(userId, newPassword);
//       if (response.status === 200) showToast("Mot de passe réinitialisé avec succès !");
//     } catch (error) {
//       showToast(error.response?.data?.error || "Erreur lors de la réinitialisation.", "error");
//     }
//   };

//   // ─── Filtrage + recherche ──────────────────────────────────────
//   const filteredUsers = useMemo(() => {
//     return users.filter((u) => {
//       const q = search.toLowerCase();
//       const matchSearch =
//         !q ||
//         u.username?.toLowerCase().includes(q) ||
//         u.email?.toLowerCase().includes(q) ||
//         u.first_name?.toLowerCase().includes(q) ||
//         u.last_name?.toLowerCase().includes(q) ||
//         u.client?.nom_entreprise?.toLowerCase().includes(q);

//       const matchRole =
//         filterRole === "all" ||
//         (filterRole === "admin" && (u.is_staff || u.role === "SUPERADMIN" || u.is_superuser)) ||
//         (filterRole === "user" && !u.is_staff && u.role !== "SUPERADMIN" && !u.is_superuser) ||
//         (filterRole === "superadmin" && (u.role === "SUPERADMIN" || u.is_superuser));

//       const matchStatus =
//         filterStatus === "all" ||
//         (filterStatus === "active" && u.is_active) ||
//         (filterStatus === "inactive" && !u.is_active);

//       return matchSearch && matchRole && matchStatus;
//     });
//   }, [users, search, filterRole, filterStatus]);

//   // ─── Statistiques ──────────────────────────────────────────────
//   const stats = useMemo(() => {
//     const total = users.length;
//     const active = users.filter(u => u.is_active).length;
//     const admins = users.filter(u => u.is_staff || u.role === "SUPERADMIN" || u.is_superuser).length;
//     const inactive = total - active;
//     return { total, active, admins, inactive };
//   }, [users]);

//   // ═══════════════════════════════════════════════════════════════
//   // RENDU
//   // ═══════════════════════════════════════════════════════════════
//   return (
//     <div className="users-page">
//       {/* ─── Toast ──────────────────────────────────────────── */}
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

//       {/* ─── En-tête ────────────────────────────────────────── */}
//       <div className="users-header">
//         <div>
//           <h1>Utilisateurs</h1>
//           <p>Gérez les comptes, les rôles et les accès de votre plateforme</p>
//         </div>
//         <button className="add-btn" onClick={() => navigate("/admin/users/create")}>
//           {Icons.plus} Ajouter un utilisateur
//         </button>
//       </div>

//       {/* ─── Cartes statistiques ────────────────────────────── */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon blue">{Icons.users}</div>
//           <div>
//             <p>Total</p>
//             <h2>{stats.total}</h2>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon green">{Icons.active}</div>
//           <div>
//             <p>Actifs</p>
//             <h2>{stats.active}</h2>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon red">{Icons.inactive}</div>
//           <div>
//             <p>Inactifs</p>
//             <h2>{stats.inactive}</h2>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon purple">{Icons.admin}</div>
//           <div>
//             <p>Administrateurs</p>
//             <h2>{stats.admins}</h2>
//           </div>
//         </div>
//       </div>

//       {/* ─── Barre de recherche & filtres ───────────────────── */}
//       <div className="filters-bar">
//         <div className="search-box">
//           {Icons.search}
//           <input
//             type="text"
//             placeholder="Rechercher un utilisateur..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <div className="filter-group">
//           <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
//             <option value="all">Tous les rôles</option>
//             <option value="admin">Administrateurs</option>
//             <option value="user">Utilisateurs</option>
//             <option value="superadmin">Super-admins</option>
//           </select>
//           <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
//             <option value="all">Tous les statuts</option>
//             <option value="active">Actifs</option>
//             <option value="inactive">Inactifs</option>
//           </select>
//           {(search || filterRole !== "all" || filterStatus !== "all") && (
//             <span className="filter-count">{filteredUsers.length} résultat{filteredUsers.length !== 1 ? "s" : ""}</span>
//           )}
//         </div>
//       </div>

//       {/* ─── Tableau ────────────────────────────────────────── */}
//       <div className="users-card">
//         {loading ? (
//           <TableSkeleton rows={6} />
//         ) : filteredUsers.length === 0 ? (
//           <EmptyState onAdd={() => navigate("/admin/users/create")} />
//         ) : (
//           <div className="table-wrapper">
//             <table className="users-table">
//               <thead>
//                 <tr>
//                   <th>Utilisateur</th>
//                   <th>Email</th>
//                   <th>Nom</th>
//                   <th>Prénom</th>
//                   <th>Client</th>
//                   <th>Schéma</th>
//                   <th>Domaine</th>
//                   <th>Statut</th>
//                   <th>Rôle</th>
//                   <th>Inscription</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.map((user) => {
//                   const isSuper = user.role === "SUPERADMIN" || user.is_superuser;
//                   const isAdmin = user.is_staff;
//                   return (
//                     <tr key={user.id}>
//                       <td>
//                         <div className="user-cell">
//                           <div className="user-avatar">
//                             {(user.first_name?.[0] || user.username?.[0] || "?").toUpperCase()}
//                           </div>
//                           <span className="user-username">{user.username}</span>
//                         </div>
//                       </td>
//                       <td>{user.email}</td>
//                       <td>{user.last_name || "—"}</td>
//                       <td>{user.first_name || "—"}</td>
//                       <td>{user.client?.nom_entreprise || "—"}</td>
//                       <td><code className="schema-tag">{user.client?.schema_name || "public"}</code></td>
//                       <td>{user.client?.domain || "—"}</td>
//                       <td>
//                         <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
//                           <span className="status-dot" />
//                           {user.is_active ? "Actif" : "Inactif"}
//                         </span>
//                       </td>
//                       <td>
//                         {isSuper ? (
//                           <span className="role-badge superadmin">Super-admin</span>
//                         ) : isAdmin ? (
//                           <span className="role-badge admin">Admin</span>
//                         ) : (
//                           <span className="role-badge user">Utilisateur</span>
//                         )}
//                       </td>
//                       <td className="date-cell">
//                         {new Date(user.date_joined).toLocaleDateString("fr-FR", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                         })}
//                       </td>
//                       <td>
//                         {isSuper ? (
//                           <span className="non-editable">Protégé</span>
//                         ) : (
//                           <div className="action-btns">
//                             <button
//                               className={`action-btn ${user.is_active ? "danger" : "success"}`}
//                               onClick={() => handleToggleStatus(user.id)}
//                               title={user.is_active ? "Désactiver" : "Activer"}
//                             >
//                               {user.is_active ? Icons.power : Icons.power}
//                               {user.is_active ? "Désactiver" : "Activer"}
//                             </button>
//                             <button
//                               className="action-btn neutral"
//                               onClick={() => handleResetPassword(user.id)}
//                               title="Réinitialiser le mot de passe"
//                             >
//                               {Icons.lock} MDP
//                             </button>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Users;