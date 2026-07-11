import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { getStatsVisites } from "../../services/authService";
import "../styles_admin/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const brandBlue = "#0f6cb3";
const brandPurple = "#8b5cf6";
const brandGreen = "#10b981";

// "2026-07-11" -> "11/07" ; "2026-07" -> "juil. 26"
const labelDate = (iso) => {
  const parts = iso.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
};

// "TG" -> "🇹🇬 Togo"
const paysLabel = (code) => {
  let drapeau = "";
  try {
    drapeau = String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) + " ";
  } catch { /* code invalide */ }
  try {
    const nom = new Intl.DisplayNames(["fr"], { type: "region" }).of(code);
    return drapeau + (nom || code);
  } catch {
    return drapeau + code;
  }
};

const PERIODES = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "12m", label: "12 mois" },
];

// Panneau liste style Plausible : barre claire derrière le libellé, nombre à droite
const PanneauListe = ({ titre, items, format }) => {
  const max = items.length ? items[0].total : 1;
  return (
    <div className="chart-card" style={{ minHeight: 240 }}>
      <div className="chart-card__header">
        <h3 className="chart-card__title">{titre}</h3>
      </div>
      <div style={{ padding: "4px 20px 16px" }}>
        {items.length === 0 && (
          <p style={{ color: "#94a3b8", fontSize: 13.5, margin: "10px 0" }}>Pas encore de données.</p>
        )}
        {items.map((it) => {
          const label = format ? format(it.valeur ?? it.path) : (it.valeur ?? it.path);
          return (
            <div key={it.valeur ?? it.path}
              style={{ position: "relative", marginBottom: 6, borderRadius: 5, overflow: "hidden" }}>
              <div style={{
                position: "absolute", inset: 0,
                width: `${Math.max(4, Math.round((it.total / max) * 100))}%`,
                background: "rgba(15,108,179,.12)", borderRadius: 5,
              }} />
              <div style={{
                position: "relative", display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "6px 10px", fontSize: 13.5,
              }}>
                <span style={{
                  color: "#1e293b", fontWeight: 600, whiteSpace: "nowrap",
                  overflow: "hidden", textOverflow: "ellipsis", marginRight: 12,
                }}>{label}</span>
                <span style={{ color: "#475569", fontWeight: 700, flexShrink: 0 }}>{it.total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [periode, setPeriode] = useState("30j");
  const [visites, setVisites] = useState(null);

  useEffect(() => {
    let actif = true;
    const charger = () =>
      getStatsVisites(periode)
        .then((res) => { if (actif) setVisites(res.data); })
        .catch((e) => console.error("Erreur stats visites:", e));
    charger();
    const timer = setInterval(charger, 60000); // rafraîchit le « en ce moment »
    return () => { actif = false; clearInterval(timer); };
  }, [periode]);

  const usersData = {
    labels: ["Administrateurs", "Employés", "Clients"],
    datasets: [
      {
        label: "Nombre d'utilisateurs",
        data: [15, 30, 120],
        backgroundColor: [brandBlue, brandPurple, brandGreen],
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f1f5f9" },
        border: { display: false },
        ticks: { color: "#64748b" },
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#64748b" },
      },
    },
  };

  const rolesData = {
    labels: ["Administrateurs", "Employés", "Clients"],
    datasets: [
      {
        data: [15, 30, 120],
        backgroundColor: [brandBlue, brandPurple, brandGreen],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, padding: 20, color: "#475569" },
      },
      tooltip: { backgroundColor: "#1e293b", padding: 12, cornerRadius: 8 },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Vue d'ensemble</h1>
        <p className="dashboard__subtitle">Bienvenue sur votre tableau de bord administrateur.</p>
      </div>

      {/* ════════ Fréquentation du site (style Plausible) ════════ */}
      <div className="chart-card" style={{ marginBottom: 24 }}>
        {/* Bandeau : site + en ce moment + périodes */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12, padding: "18px 20px 6px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f4f7b" }}>
              🌐 optinet-sarlu.ginolux.com
            </h3>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569", fontWeight: 600 }}>
              <span style={{
                width: 9, height: 9, borderRadius: "50%", background: "#22c55e",
                boxShadow: "0 0 0 3px rgba(34,197,94,.25)", display: "inline-block",
              }} />
              {visites ? visites.live : "…"} visiteur{visites && visites.live > 1 ? "s" : ""} en ce moment
            </span>
          </div>
          <div style={{ display: "flex", gap: 4, background: "#f1f5f9", borderRadius: 10, padding: 4 }}>
            {PERIODES.map((p) => (
              <button key={p.key} onClick={() => setPeriode(p.key)}
                style={{
                  border: "none", cursor: "pointer", borderRadius: 7,
                  padding: "7px 14px", fontSize: 13, fontWeight: 700,
                  background: periode === p.key ? "#ffffff" : "transparent",
                  color: periode === p.key ? brandBlue : "#64748b",
                  boxShadow: periode === p.key ? "0 1px 4px rgba(0,0,0,.09)" : "none",
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bandeau de chiffres */}
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap", padding: "12px 20px 4px" }}>
          {[
            ["Visiteurs uniques", visites ? visites.totaux.visiteurs : "…"],
            ["Pages vues", visites ? visites.totaux.pages_vues : "…"],
            ["Vues par visite", visites ? visites.totaux.vues_par_visite : "…"],
            ["Aujourd'hui", visites ? visites.aujourd_hui.visiteurs : "…"],
          ].map(([lbl, val]) => (
            <div key={lbl}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 }}>{lbl}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1.25 }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Grande courbe */}
        <div style={{ height: 280, padding: "8px 14px 14px" }}>
          {visites && (
            <Line
              data={{
                labels: visites.serie.map((j) => labelDate(j.date)),
                datasets: [{
                  label: "Visiteurs",
                  data: visites.serie.map((j) => j.visiteurs),
                  borderColor: brandBlue,
                  borderWidth: 2,
                  pointRadius: visites.serie.length > 14 ? 0 : 3,
                  pointHoverRadius: 5,
                  pointBackgroundColor: brandBlue,
                  fill: true,
                  backgroundColor: (ctx) => {
                    const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280);
                    g.addColorStop(0, "rgba(15,108,179,.25)");
                    g.addColorStop(1, "rgba(15,108,179,.02)");
                    return g;
                  },
                  tension: 0.3,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "#1e293b", padding: 12, cornerRadius: 8, displayColors: false,
                    callbacks: {
                      afterLabel: (ctx) => `Pages vues : ${visites.serie[ctx.dataIndex].pages_vues}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" },
                    border: { display: false },
                    ticks: { color: "#64748b", precision: 0 },
                  },
                  x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: "#64748b", maxTicksLimit: 10 },
                  },
                },
              }}
            />
          )}
        </div>
      </div>

      {/* Panneaux style Plausible */}
      {visites && (
        <div className="dashboard__charts" style={{ marginBottom: 24 }}>
          <PanneauListe titre="Pages les plus visitées" items={visites.top_pages}
            format={(p) => (p === "/" ? "/ (Accueil)" : p)} />
          <PanneauListe titre="Sources de trafic" items={visites.sources} />
        </div>
      )}
      {visites && (
        <div className="dashboard__charts" style={{ marginBottom: 24 }}>
          <PanneauListe titre="Appareils" items={visites.appareils} />
          {visites.pays.length > 0
            ? <PanneauListe titre="Pays" items={visites.pays} format={paysLabel} />
            : <PanneauListe titre="Navigateurs" items={visites.navigateurs} />}
        </div>
      )}
      {visites && visites.pays.length > 0 && (
        <div className="dashboard__charts" style={{ marginBottom: 24 }}>
          <PanneauListe titre="Navigateurs" items={visites.navigateurs} />
          <div />
        </div>
      )}

      {/* ════════ Utilisateurs (données de démonstration) ════════ */}
      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Total Utilisateurs</h3>
            <p className="stat-card__value">165</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Comptes Actifs</h3>
            <p className="stat-card__value">142</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Comptes Inactifs</h3>
            <p className="stat-card__value">23</p>
          </div>
        </div>
      </div>

      <div className="dashboard__charts">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Évolution des inscriptions</h3>
          </div>
          <div className="chart-card__content">
            <Bar data={usersData} options={barOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Répartition par rôle</h3>
          </div>
          <div className="chart-card__content">
            <Doughnut data={rolesData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
