import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

/* ── Utilitaires ── */
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8001";

const getStored = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

/* ══════════════════════════════════════════════
   ICÔNES
══════════════════════════════════════════════ */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

/* ══════════════════════════════════════════════
   SOUS-COMPOSANTS UI
══════════════════════════════════════════════ */
const SettingRow = ({ icon, label, description, children }) => (
  <div className="sett-row">
    <div className="sett-row__left">
      <div className="sett-row__icon">{icon}</div>
      <div>
        <div className="sett-row__label">{label}</div>
        {description && <div className="sett-row__desc">{description}</div>}
      </div>
    </div>
    <div className="sett-row__control">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    className={`sett-toggle${checked ? " sett-toggle--on" : ""}`}
    onClick={() => onChange(!checked)}
  >
    <span className="sett-toggle__thumb" />
  </button>
);

const SectionCard = ({ title, icon, children }) => (
  <div className="sett-card">
    <div className="sett-card__header">
      <span className="sett-card__icon">{icon}</span>
      <h2 className="sett-card__title">{title}</h2>
    </div>
    <div className="sett-card__body">{children}</div>
  </div>
);

/* ══════════════════════════════════════════════
   PAGE SETTINGS
══════════════════════════════════════════════ */
const Settings = () => {
  const navigate = useNavigate();

  /* ── Onglet actif ── */
  const [tab, setTab] = useState("profil");

  /* ── Profil Admin ── */
  const [profil, setProfil] = useState({
    nom: "Administrateur",
    email: localStorage.getItem("admin_email") || "admin@optinet.com",
    telephone: "+228 90 74 84 65",
    role: "Directeur Général",
  });

  /* ── Mot de passe ── */
  const [pwd, setPwd] = useState({ ancien: "", nouveau: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState(null);

  /* ── Notifications ── */
  const [notif, setNotif] = useState({
    emailNewMessage: getStored("sett_emailNewMsg", true),
    emailNewCommande: getStored("sett_emailNewCmd", true),
    browserNotif: getStored("sett_browserNotif", false),
    soundAlert: getStored("sett_soundAlert", false),
    pollInterval: getStored("sett_pollInterval", 30),
  });

  /* ── Apparence ── */
  const [apparence, setApparence] = useState({
    theme: getStored("sett_theme", "light"),
    sidebarCompact: getStored("sett_compact", false),
    animations: getStored("sett_anim", true),
    langue: getStored("sett_langue", "fr"),
  });

  /* ── Système ── */
  const [systeme, setSysteme] = useState({
    apiUrl: API_URL,
    debugMode: false,
    autoLogout: getStored("sett_autoLogout", 30),
  });

  const [saveMsg, setSaveMsg] = useState(null);

  /* ── Persistance ── */
  const saveNotif = (next) => {
    setNotif(next);
    Object.entries({
      sett_emailNewMsg: next.emailNewMessage,
      sett_emailNewCmd: next.emailNewCommande,
      sett_browserNotif: next.browserNotif,
      sett_soundAlert: next.soundAlert,
      sett_pollInterval: next.pollInterval,
    }).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  };

  const saveApparence = (next) => {
    setApparence(next);
    Object.entries({
      sett_theme: next.theme,
      sett_compact: next.sidebarCompact,
      sett_anim: next.animations,
      sett_langue: next.langue,
    }).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
  };

  const saveAutoLogout = (val) => {
    const next = { ...systeme, autoLogout: val };
    setSysteme(next);
    localStorage.setItem("sett_autoLogout", JSON.stringify(val));
  };

  /* ── Changement de mot de passe (local seulement, UI) ── */
  const handlePwdSubmit = (e) => {
    e.preventDefault();
    if (!pwd.ancien) return setPwdMsg({ type: "error", text: "Saisissez votre mot de passe actuel." });
    if (pwd.nouveau.length < 8) return setPwdMsg({ type: "error", text: "Le nouveau mot de passe doit faire au moins 8 caractères." });
    if (pwd.nouveau !== pwd.confirm) return setPwdMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
    setPwdMsg({ type: "success", text: "Mot de passe mis à jour avec succès." });
    setPwd({ ancien: "", nouveau: "", confirm: "" });
    setTimeout(() => setPwdMsg(null), 4000);
  };

  /* ── Sauvegarder le profil ── */
  const handleProfilSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("admin_email", profil.email);
    setSaveMsg({ type: "success", text: "Profil enregistré avec succès." });
    setTimeout(() => setSaveMsg(null), 3500);
  };

  /* ── Déconnexion ── */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  /* ── Onglets ── */
  const TABS = [
    { key: "profil",        label: "Profil",          icon: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
    { key: "securite",      label: "Sécurité",         icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { key: "notifications", label: "Notifications",    icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" },
    { key: "apparence",     label: "Apparence",        icon: "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" },
    { key: "systeme",       label: "Système",          icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" },
  ];

  return (
    <div className="settings-page">

      {/* ── En-tête ── */}
      <div className="settings-page__header">
        <div>
          <h1 className="settings-page__title">Paramètres</h1>
          <p className="settings-page__subtitle">Gérez votre compte et les préférences de l'application.</p>
        </div>
      </div>

      {/* ── Message de sauvegarde global ── */}
      {saveMsg && (
        <div className={`sett-alert sett-alert--${saveMsg.type}`}>
          {saveMsg.type === "success"
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          }
          {saveMsg.text}
        </div>
      )}

      <div className="settings-layout">

        {/* ── Sidebar onglets ── */}
        <nav className="settings-nav">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`settings-nav__btn${tab === key ? " settings-nav__btn--active" : ""}`}
              onClick={() => setTab(key)}
            >
              <Icon d={icon} size={16} />
              {label}
            </button>
          ))}

          <div className="settings-nav__divider" />

          <button className="settings-nav__btn settings-nav__btn--logout" onClick={handleLogout}>
            <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={16} />
            Déconnexion
          </button>
        </nav>

        {/* ── Contenu ── */}
        <div className="settings-content">

          {/* ══ PROFIL ══ */}
          {tab === "profil" && (
            <SectionCard
              title="Informations du profil"
              icon={<Icon d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" size={17} />}
            >
              <form onSubmit={handleProfilSubmit} className="sett-form">
                <div className="sett-avatar-row">
                  <div className="sett-avatar">
                    {(profil.nom || "A").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="sett-avatar-name">{profil.nom}</div>
                    <div className="sett-avatar-role">{profil.role}</div>
                  </div>
                </div>

                <div className="sett-form__grid">
                  <div className="sett-field">
                    <label className="sett-field__label">Nom complet</label>
                    <input className="sett-field__input" value={profil.nom}
                      onChange={(e) => setProfil({ ...profil, nom: e.target.value })} />
                  </div>
                  <div className="sett-field">
                    <label className="sett-field__label">Adresse email</label>
                    <input className="sett-field__input" type="email" value={profil.email}
                      onChange={(e) => setProfil({ ...profil, email: e.target.value })} />
                  </div>
                  <div className="sett-field">
                    <label className="sett-field__label">Téléphone</label>
                    <input className="sett-field__input" value={profil.telephone}
                      onChange={(e) => setProfil({ ...profil, telephone: e.target.value })} />
                  </div>
                  <div className="sett-field">
                    <label className="sett-field__label">Rôle</label>
                    <select className="sett-field__input" value={profil.role}
                      onChange={(e) => setProfil({ ...profil, role: e.target.value })}>
                      <option>Directeur Général</option>
                      <option>Secrétaire Général</option>
                      <option>Chef Département</option>
                      <option>Chef Projet</option>
                      <option>Développeur</option>
                    </select>
                  </div>
                </div>

                <div className="sett-form__actions">
                  <button type="submit" className="sett-btn sett-btn--primary">Enregistrer le profil</button>
                </div>
              </form>
            </SectionCard>
          )}

          {/* ══ SÉCURITÉ ══ */}
          {tab === "securite" && (
            <SectionCard
              title="Sécurité & Mot de passe"
              icon={<Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={17} />}
            >
              <form onSubmit={handlePwdSubmit} className="sett-form">
                {pwdMsg && (
                  <div className={`sett-alert sett-alert--${pwdMsg.type}`}>
                    {pwdMsg.type === "success"
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>
                    }
                    {pwdMsg.text}
                  </div>
                )}
                <div className="sett-field">
                  <label className="sett-field__label">Mot de passe actuel</label>
                  <input className="sett-field__input" type="password" autoComplete="current-password"
                    value={pwd.ancien} onChange={(e) => setPwd({ ...pwd, ancien: e.target.value })}
                    placeholder="••••••••" />
                </div>
                <div className="sett-form__grid">
                  <div className="sett-field">
                    <label className="sett-field__label">Nouveau mot de passe</label>
                    <input className="sett-field__input" type="password" autoComplete="new-password"
                      value={pwd.nouveau} onChange={(e) => setPwd({ ...pwd, nouveau: e.target.value })}
                      placeholder="••••••••" />
                    <div className="sett-field__hint">Minimum 8 caractères</div>
                  </div>
                  <div className="sett-field">
                    <label className="sett-field__label">Confirmer le mot de passe</label>
                    <input className="sett-field__input" type="password" autoComplete="new-password"
                      value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                      placeholder="••••••••" />
                  </div>
                </div>
                <div className="sett-form__actions">
                  <button type="submit" className="sett-btn sett-btn--primary">Changer le mot de passe</button>
                </div>
              </form>

              <div className="sett-divider" />

              <div className="sett-danger-zone">
                <h3 className="sett-danger-zone__title">Zone de danger</h3>
                <SettingRow
                  icon={<Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />}
                  label="Se déconnecter de tous les appareils"
                  description="Invalide toutes les sessions actives"
                >
                  <button className="sett-btn sett-btn--danger" onClick={handleLogout}>
                    Déconnexion
                  </button>
                </SettingRow>
              </div>
            </SectionCard>
          )}

          {/* ══ NOTIFICATIONS ══ */}
          {tab === "notifications" && (
            <SectionCard
              title="Préférences de notifications"
              icon={<Icon d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" size={17} />}
            >
              <SettingRow
                icon={<Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />}
                label="Email — Nouveau message reçu"
                description="Recevez un email à chaque nouveau message du formulaire de contact"
              >
                <Toggle checked={notif.emailNewMessage}
                  onChange={(v) => saveNotif({ ...notif, emailNewMessage: v })} />
              </SettingRow>

              <SettingRow
                icon={<Icon d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />}
                label="Email — Nouvelle commande"
                description="Recevez un email à chaque nouvelle commande boutique"
              >
                <Toggle checked={notif.emailNewCommande}
                  onChange={(v) => saveNotif({ ...notif, emailNewCommande: v })} />
              </SettingRow>

              <SettingRow
                icon={<Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />}
                label="Notifications navigateur"
                description="Activez les notifications push dans votre navigateur"
              >
                <Toggle checked={notif.browserNotif}
                  onChange={(v) => saveNotif({ ...notif, browserNotif: v })} />
              </SettingRow>

              <SettingRow
                icon={<Icon d="M9 18V5l12-2v13M6 15a3 3 0 100 6 3 3 0 000-6zM18 13a3 3 0 100 6 3 3 0 000-6z" />}
                label="Son d'alerte"
                description="Joue un son lors d'une nouvelle notification"
              >
                <Toggle checked={notif.soundAlert}
                  onChange={(v) => saveNotif({ ...notif, soundAlert: v })} />
              </SettingRow>

              <SettingRow
                icon={<Icon d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />}
                label="Intervalle d'actualisation"
                description="Fréquence de vérification des nouveaux messages (secondes)"
              >
                <select
                  className="sett-field__input sett-field__input--sm"
                  value={notif.pollInterval}
                  onChange={(e) => saveNotif({ ...notif, pollInterval: Number(e.target.value) })}
                >
                  <option value={15}>15 secondes</option>
                  <option value={30}>30 secondes</option>
                  <option value={60}>1 minute</option>
                  <option value={120}>2 minutes</option>
                  <option value={300}>5 minutes</option>
                </select>
              </SettingRow>
            </SectionCard>
          )}

          {/* ══ APPARENCE ══ */}
          {tab === "apparence" && (
            <SectionCard
              title="Apparence & Interface"
              icon={<Icon d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" size={17} />}
            >
              <SettingRow
                icon={<Icon d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />}
                label="Thème"
                description="Mode clair ou sombre pour l'interface admin"
              >
                <div className="sett-theme-btns">
                  {[["light", "Clair"], ["dark", "Sombre"], ["auto", "Auto"]].map(([val, lbl]) => (
                    <button key={val}
                      className={`sett-theme-btn${apparence.theme === val ? " sett-theme-btn--active" : ""}`}
                      onClick={() => saveApparence({ ...apparence, theme: val })}
                    >{lbl}</button>
                  ))}
                </div>
              </SettingRow>

              <SettingRow
                icon={<Icon d="M3 12h18M3 6h18M3 18h18" />}
                label="Sidebar compacte"
                description="Réduire la sidebar pour avoir plus d'espace de travail"
              >
                <Toggle checked={apparence.sidebarCompact}
                  onChange={(v) => saveApparence({ ...apparence, sidebarCompact: v })} />
              </SettingRow>

              <SettingRow
                icon={<Icon d="M4.5 12.5l3 3 7-7" />}
                label="Animations d'interface"
                description="Activer les transitions et animations fluides"
              >
                <Toggle checked={apparence.animations}
                  onChange={(v) => saveApparence({ ...apparence, animations: v })} />
              </SettingRow>

              <SettingRow
                icon={<Icon d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />}
                label="Langue de l'interface"
                description="Langue d'affichage du panneau d'administration"
              >
                <select className="sett-field__input sett-field__input--sm"
                  value={apparence.langue}
                  onChange={(e) => saveApparence({ ...apparence, langue: e.target.value })}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </SettingRow>
            </SectionCard>
          )}

          {/* ══ SYSTÈME ══ */}
          {tab === "systeme" && (
            <SectionCard
              title="Informations système"
              icon={<Icon d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" size={17} />}
            >
              <div className="sett-info-grid">
                {[
                  ["Version front-end", "React 19 + Vite 8"],
                  ["Backend", "Django 5.2 + DRF"],
                  ["Base de données", "SQLite (local)"],
                  ["API URL", systeme.apiUrl],
                  ["Authentification", "JWT (SimpleJWT)"],
                  ["Email SMTP", "Gmail — optinetsarl@gmail.com"],
                ].map(([k, v]) => (
                  <div key={k} className="sett-info-row">
                    <span className="sett-info-row__key">{k}</span>
                    <span className="sett-info-row__val">{v}</span>
                  </div>
                ))}
              </div>

              <div className="sett-divider" />

              <SettingRow
                icon={<Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                label="Déconnexion automatique"
                description="Durée d'inactivité avant déconnexion automatique"
              >
                <select className="sett-field__input sett-field__input--sm"
                  value={systeme.autoLogout}
                  onChange={(e) => saveAutoLogout(Number(e.target.value))}>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={120}>2 heures</option>
                  <option value={0}>Jamais</option>
                </select>
              </SettingRow>

              <div className="sett-divider" />

              <div className="sett-sys-actions">
                <button className="sett-btn sett-btn--outline" onClick={() => {
                  localStorage.clear(); window.location.reload();
                }}>
                  <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" size={15} />
                  Réinitialiser les préférences
                </button>
                <button className="sett-btn sett-btn--danger" onClick={handleLogout}>
                  <Icon d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" size={15} />
                  Se déconnecter
                </button>
              </div>
            </SectionCard>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;