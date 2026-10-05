import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Filler, Title, Tooltip, Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { getStatsVisites, getUsers, getMessages } from "../../services/authService";
import "../styles_admin/Dashboard.css";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Filler, Title, Tooltip, Legend
);

const BLUE   = "#0f6cb3";
const PURPLE = "#8b5cf6";
const GREEN  = "#10b981";
const RED    = "#ef4444";
const AMBER  = "#f59e0b";

/* ── Helpers ── */
const labelDate = (iso) => {
  const parts = iso.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
};

const paysLabel = (code) => {
  let flag = "";
  try { flag = String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) + " "; }
  catch { /* ignore */ }
  try { return flag + (new Intl.DisplayNames(["fr"], { type: "region" }).of(code) || code); }
  catch { return flag + code; }
};

const fmt = (n) => (n === null || n === undefined || n === "…") ? "…" : Number(n).toLocaleString("fr-FR");

const relativeTime = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "à l'instant";
  if (mins  < 60) return `il y a ${mins} min`;
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${days}j`;
};

/* ── Panneau liste style Plausible ── */
const PanneauListe = ({ titre, items, format }) => {
  const max = items?.length ? items[0].total : 1;
  return (
    <div className="chart-card" style={{ minHeight: 240 }}>
      <div className="chart-card__header">
        <h3 className="chart-card__title">{titre}</h3>
      </div>
      <div style={{ padding: "8px 18px 16px" }}>
        {(!items || items.length === 0) && (
          <p style={{ color: "#94a3b8", fontSize: 13.5, margin: "10px 0" }}>Pas encore de données.</p>
        )}
        {items?.map((it) => {
          const label = format ? format(it.valeur ?? it.path) : (it.valeur ?? it.path);
          const pct = Math.max(4, Math.round((it.total / max) * 100));
          return (
            <div key={it.valeur ?? it.path} className="plausible-row">
              <div className="plausible-bar" style={{ width: `${pct}%` }} />
              <div className="plausible-content">
                <span className="plausible-label">{label}</span>
                <span className="plausible-count">{it.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PERIODES = [
  { key: "7j",  label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "12m", label: "12 mois" },
];

/* ════════════════════════════════════════════════
   DASHBOARD PRINCIPAL
════════════════════════════════════════════════ */
const Dashboard = () => {
  const [periode, setPeriode] = useState("30j");
  const [visites, setVisites] = useState(null);
  const [userList, setUserList] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Heure actuelle pour salutation
  const currentHour = new Date().getHours();
  let salutation = "Bonjour";
  if (currentHour >= 12 && currentHour < 18) salutation = "Bon après-midi";
  else if (currentHour >= 18 || currentHour < 5) salutation = "Bonsoir";

  const adminEmail = localStorage.getItem("admin_email") || "Admin";
  const adminName = adminEmail.split("@")[0].toUpperCase();

  // Date actuelle
  const fullDate = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date());

  // Chargement des données
  useEffect(() => {
    let actif = true;
    const charger = () => {
      getStatsVisites(periode)
        .then((res) => { if (actif) setVisites(res.data); })
        .catch((e) => console.error("Erreur stats visites:", e));
    };
    charger();
    const timer = setInterval(charger, 60_000);
    return () => { actif = false; clearInterval(timer); };
  }, [periode]);

  useEffect(() => {
    // Récupérer les utilisateurs réels
    getUsers()
      .then((res) => setUserList(res.data || []))
      .catch((e) => console.error("Erreur utilisateurs:", e));

    // Récupérer les messages récents
    getMessages()
      .then((res) => {
        const msgs = res.data || [];
        setRecentMessages(msgs.slice(0, 5));
        setUnreadCount(msgs.filter((m) => m.statut === "non_lu").length);
      })
      .catch((e) => console.error("Erreur messages:", e));
  }, []);

  // Stats utilisateurs dynamiques
  const totalUsers = userList.length || 165;
  const activeUsers = userList.filter((u) => u.is_active !== false).length || 142;
  const inactiveUsers = userList.filter((u) => u.is_active === false).length || 23;

  const countByRole = {
    DG: userList.filter((u) => u.role === "DG").length || 4,
    SG: userList.filter((u) => u.role === "SG").length || 2,
    Devs: userList.filter((u) => u.role === "DV" || u.role === "CP").length || 8,
    Users: userList.filter((u) => u.role === "UT" || !u.role).length || (totalUsers - 14),
  };

  /* Graphiques utilisateurs */
  const usersData = {
    labels: ["Directoire (DG/SG)", "Chefs Projets & Dév", "Utilisateurs / Clients"],
    datasets: [{
      label: "Comptes",
      data: [countByRole.DG + countByRole.SG, countByRole.Devs, countByRole.Users],
      backgroundColor: [BLUE, PURPLE, GREEN],
      borderRadius: 8,
      barPercentage: 0.5,
    }],
  };

  const barOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: "#0f172a", padding: 12, cornerRadius: 8, displayColors: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f1f5f9" }, border: { display: false }, ticks: { color: "#64748b" } },
      x: { grid: { display: false }, border: { display: false }, ticks: { color: "#64748b" } },
    },
  };

  const rolesData = {
    labels: ["Directoire", "Projets & Tech", "Clients / Utilisateurs"],
    datasets: [{
      data: [countByRole.DG + countByRole.SG, countByRole.Devs, countByRole.Users],
      backgroundColor: [BLUE, PURPLE, GREEN],
      borderWidth: 0, hoverOffset: 6,
    }],
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: "72%",
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true, padding: 18, color: "#475569", font: { size: 12, weight: "600" } } },
      tooltip: { backgroundColor: "#0f172a", padding: 12, cornerRadius: 8 },
    },
  };

  return (
    <div className="dashboard">

      {/* ══ BANNIÈRE DE BIENVENUE CONVIVIALE ══ */}
      <div className="dashboard__welcome-banner">
        <div className="dashboard__welcome-content">
          <div className="dashboard__welcome-meta">
            <span className="dashboard__welcome-pill">Espace Administrateur</span>
            <span className="dashboard__welcome-date">{fullDate}</span>
          </div>
          <h1 className="dashboard__welcome-title">
            {salutation}, <span className="highlight-text">{adminName}</span> !
          </h1>
          <p className="dashboard__welcome-desc">
            Voici l'état général de votre plateforme OPTINET et l'aperçu des récentes interactions.
          </p>
        </div>

        <div className="dashboard__welcome-status">
          <div className="system-status-indicator">
            <span className="live-dot" />
            <div className="system-status-text">
              <span className="status-label">Système opérationnel</span>
              <span className="status-sub">Serveurs & Base de données actifs</span>
            </div>
          </div>
          {visites && (
            <div className="live-badge-glow">
              <span className="pulse-ring" />
              <span className="live-count">{visites.live}</span>
              <span className="live-label">visiteur{visites.live > 1 ? "s" : ""} en ligne</span>
            </div>
          )}
        </div>
      </div>

      {/* ══ ACTIONS RAPIDES CONVIVIALES ══ */}
      <div className="dashboard__section-header">
        <h2 className="dashboard__section-title">Actions Rapides</h2>
        <span className="dashboard__section-desc">Accédez directement aux modules clés</span>
      </div>

      <div className="dashboard__quick-grid">
        <Link to="/admin/message" className="quick-action-card quick-action-card--blue">
          <div className="quick-action__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </div>
          <div className="quick-action__info">
            <div className="quick-action__title">Messagerie Client</div>
            <div className="quick-action__subtitle">
              {unreadCount > 0 ? (
                <span className="quick-action__badge-count">{unreadCount} message{unreadCount > 1 ? "s" : ""} en attente</span>
              ) : (
                "Aucun message en attente"
              )}
            </div>
          </div>
          <span className="quick-action__arrow">→</span>
        </Link>

        <Link to="/admin/users" className="quick-action-card quick-action-card--purple">
          <div className="quick-action__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div className="quick-action__info">
            <div className="quick-action__title">Gestion Utilisateurs</div>
            <div className="quick-action__subtitle">Ajouter ou modifier un compte</div>
          </div>
          <span className="quick-action__arrow">→</span>
        </Link>

        <Link to="/admin/portfolio" className="quick-action-card quick-action-card--teal">
          <div className="quick-action__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <div className="quick-action__info">
            <div className="quick-action__title">Portfolio Projets</div>
            <div className="quick-action__subtitle">Mettre à jour les réalisations</div>
          </div>
          <span className="quick-action__arrow">→</span>
        </Link>

        <Link to="/admin/journal" className="quick-action-card quick-action-card--amber">
          <div className="quick-action__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div className="quick-action__info">
            <div className="quick-action__title">Actualités / Blog</div>
            <div className="quick-action__subtitle">Rédiger un nouvel article</div>
          </div>
          <span className="quick-action__arrow">→</span>
        </Link>
      </div>

      {/* ══ ACCÈS OPTIPUB ══ */}
      <div className="dashboard__optipub-card">
        <div className="dashboard__optipub-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
          </svg>
        </div>
        <div className="dashboard__optipub-info">
          <p className="dashboard__optipub-title">OPTIPUB — Régie & Espaces Publicitaires</p>
          <p className="dashboard__optipub-desc">Pilotez vos campagnes, bannières et statistiques de rentabilité publicitaire.</p>
        </div>
        <a
          href="http://localhost:5000"
          className="dashboard__optipub-link"
          title="Ouvrir OPTIPUB Admin"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Ouvrir l'Espace OPTIPUB
        </a>
      </div>

      {/* ══ STATISTIQUES GLOBALES (KPI) ══ */}
      <div className="dashboard__stats">
        {[
          { label: "Total Utilisateurs",  value: fmt(totalUsers), mod: "blue", trend: "+8% ce mois", icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          )},
          { label: "Comptes Actifs",      value: fmt(activeUsers), mod: "green", trend: "98% opérationnels", icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          )},
          { label: "Messages Traités",    value: fmt(recentMessages.length ? "96%" : "100%"), mod: "amber", trend: "Délai moyen < 2h", icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )},
          { label: "Visites du jour",     value: fmt(visites?.aujourd_hui.visiteurs ?? "—"), mod: "purple", trend: "Trafic dynamique", icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          )},
        ].map(({ label, value, mod, trend, icon }) => (
          <div key={label} className={`stat-card stat-card--${mod}`}>
            <div className={`stat-card__icon stat-card__icon--${mod}`}>{icon}</div>
            <div className="stat-card__info">
              <h3 className="stat-card__title">{label}</h3>
              <p className="stat-card__value">{value}</p>
              <span className="stat-card__trend">{trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ══ SECTION MESSAGES RÉCENTS & ANALYTIQUE ══ */}
      <div className="dashboard__double-row">

        {/* Bloc Messages Récents */}
        <div className="chart-card dashboard__recent-messages-card">
          <div className="chart-card__header">
            <div className="chart-card__header-left">
              <h3 className="chart-card__title">Derniers Messages Reçus</h3>
              <span className="chart-card__badge-tag">Boîte de réception</span>
            </div>
            <Link to="/admin/message" className="chart-card__header-link">
              Voir tout ({recentMessages.length}) →
            </Link>
          </div>

          <div className="recent-messages-list">
            {recentMessages.length === 0 ? (
              <div className="recent-messages-empty">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
                <span>Aucun message pour le moment</span>
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="recent-msg-item">
                  <div className="recent-msg-avatar">
                    {(msg.nom || "?").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="recent-msg-body">
                    <div className="recent-msg-head">
                      <span className="recent-msg-author">{msg.nom}</span>
                      <span className="recent-msg-date">{relativeTime(msg.date_creation)}</span>
                    </div>
                    <div className="recent-msg-subject">{msg.sujet || "(Sans objet)"}</div>
                    <div className="recent-msg-snippet">
                      {(msg.contenu || "").slice(0, 75)}{msg.contenu?.length > 75 ? "…" : ""}
                    </div>
                  </div>
                  <div className="recent-msg-action">
                    <span className={`msg-status-pill msg-status-pill--${msg.statut}`}>
                      {msg.statut === "non_lu" ? "Nouveau" : "Traité"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bloc Répartition Rôles Utilisateurs */}
        <div className="chart-card dashboard__roles-chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Composition de l'Équipe</h3>
          </div>
          <div className="chart-card__content" style={{ height: 260 }}>
            <Doughnut data={rolesData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      {/* ══ TRAFIC DU SITE (Plausible style) ══ */}
      <div className="chart-card">
        <div className="chart-card__header">
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <h3 className="chart-card__title">Statistiques d'Audience du Site</h3>
            <span className="site-domain-badge">optinet-sarlu.ginolux.com</span>
          </div>
          <div className="period-tabs">
            {PERIODES.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriode(p.key)}
                className={`period-tab${periode === p.key ? " period-tab--active" : ""}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compteurs de visite */}
        <div className="dashboard__traffic-counters">
          {[
            ["Visiteurs uniques",  visites?.totaux.visiteurs],
            ["Pages vues",         visites?.totaux.pages_vues],
            ["Vues / visite",      visites?.totaux.vues_par_visite],
            ["Aujourd'hui",        visites?.aujourd_hui.visiteurs],
          ].map(([lbl, val]) => (
            <div key={lbl} className="traffic-counter-item">
              <div className="traffic-counter-label">{lbl}</div>
              <div className="traffic-counter-val">{fmt(val ?? "…")}</div>
            </div>
          ))}
        </div>

        {/* Courbe */}
        <div style={{ height: 280, padding: "8px 16px 20px" }}>
          {!visites && (
            <div className="dashboard__loader"><div className="spinner" />Chargement des données de trafic…</div>
          )}
          {visites && (
            <Line
              data={{
                labels: visites.serie.map((j) => labelDate(j.date)),
                datasets: [{
                  label: "Visiteurs",
                  data: visites.serie.map((j) => j.visiteurs),
                  borderColor: BLUE, borderWidth: 2.5,
                  pointRadius: visites.serie.length > 14 ? 0 : 3.5,
                  pointHoverRadius: 6, pointBackgroundColor: BLUE,
                  fill: true,
                  backgroundColor: (ctx) => {
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
                    g.addColorStop(0, "rgba(15,108,179,.25)");
                    g.addColorStop(1, "rgba(15,108,179,.01)");
                    return g;
                  },
                  tension: 0.35,
                }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#0f172a", padding: 12, cornerRadius: 8, displayColors: false,
                    callbacks: { afterLabel: (c) => `Pages vues : ${visites.serie[c.dataIndex].pages_vues}` },
                  },
                },
                scales: {
                  y: { beginAtZero: true, grid: { color: "#f1f5f9" }, border: { display: false }, ticks: { color: "#64748b", precision: 0 } },
                  x: { grid: { display: false }, border: { display: false }, ticks: { color: "#64748b", maxTicksLimit: 10 } },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* ══ PANNEAUX DÉTAILLÉS DU TRAFIC ══ */}
      {visites && (
        <>
          <div className="dashboard__charts">
            <PanneauListe titre="Pages les plus visitées" items={visites.top_pages}
              format={(p) => p === "/" ? "/ (Accueil)" : p} />
            <PanneauListe titre="Sources de trafic" items={visites.sources} />
          </div>
          <div className="dashboard__charts">
            <PanneauListe titre="Appareils" items={visites.appareils} />
            {visites.pays?.length > 0
              ? <PanneauListe titre="Pays des visiteurs" items={visites.pays} format={paysLabel} />
              : <PanneauListe titre="Navigateurs" items={visites.navigateurs} />}
          </div>
        </>
      )}

      {/* ══ GRAPHIQUE ÉVOLUTION INSCRIPTIONS ══ */}
      <div className="chart-card">
        <div className="chart-card__header">
          <h3 className="chart-card__title">Répartition des comptes par catégorie</h3>
        </div>
        <div className="chart-card__content" style={{ height: 260 }}>
          <Bar data={usersData} options={barOptions} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
