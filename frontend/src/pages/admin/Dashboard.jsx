import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { getStatsVisites } from "../../services/authService";
import "../styles_admin/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// "2026-07-11" -> "11/07"
const jourCourt = (iso) => {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
};

const Dashboard = () => {
  const [visites, setVisites] = useState(null);

  useEffect(() => {
    getStatsVisites()
      .then((res) => setVisites(res.data))
      .catch((e) => console.error("Erreur stats visites:", e));
  }, []);
  // Belles couleurs modernes pour les graphiques
  const brandBlue = "#0f6cb3";
  const brandPurple = "#8b5cf6";
  const brandGreen = "#10b981";

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
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f1f5f9",
        },
        border: {
          display: false
        },
        ticks: {
          color: "#64748b"
        }
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false
        },
        ticks: {
          color: "#64748b"
        }
      }
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
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: "#475569"
        }
      },
      tooltip: {
        backgroundColor: "#1e293b",
        padding: 12,
        cornerRadius: 8,
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Vue d'ensemble</h1>
        <p className="dashboard__subtitle">Bienvenue sur votre tableau de bord administrateur.</p>
      </div>

      {/* ── Fréquentation du site ── */}
      <div className="dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Visiteurs aujourd'hui</h3>
            <p className="stat-card__value">{visites ? visites.aujourd_hui.visiteurs : "…"}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Visiteurs — 7 jours</h3>
            <p className="stat-card__value">{visites ? visites.semaine.visiteurs : "…"}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Visiteurs — 30 jours</h3>
            <p className="stat-card__value">{visites ? visites.mois.visiteurs : "…"}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className="stat-card__info">
            <h3 className="stat-card__title">Pages vues — 30 jours</h3>
            <p className="stat-card__value">{visites ? visites.mois.pages_vues : "…"}</p>
          </div>
        </div>
      </div>

      <div className="dashboard__charts">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Visiteurs — 30 derniers jours</h3>
          </div>
          <div className="chart-card__content">
            {visites && (
              <Bar
                data={{
                  labels: visites.serie.map((j) => jourCourt(j.date)),
                  datasets: [{
                    label: "Visiteurs",
                    data: visites.serie.map((j) => j.visiteurs),
                    backgroundColor: brandBlue,
                    borderRadius: 4,
                    barPercentage: 0.7,
                  }],
                }}
                options={{
                  ...barOptions,
                  scales: {
                    ...barOptions.scales,
                    y: { ...barOptions.scales.y, ticks: { ...barOptions.scales.y.ticks, precision: 0 } },
                    x: { ...barOptions.scales.x, ticks: { ...barOptions.scales.x.ticks, maxTicksLimit: 8 } },
                  },
                  plugins: {
                    ...barOptions.plugins,
                    tooltip: {
                      ...barOptions.plugins.tooltip,
                      callbacks: {
                        afterLabel: (ctx) => `Pages vues : ${visites.serie[ctx.dataIndex].pages_vues}`,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3 className="chart-card__title">Pages les plus visitées — 30 jours</h3>
          </div>
          <div className="chart-card__content" style={{ overflowY: "auto" }}>
            {visites && visites.top_pages.length === 0 && (
              <p style={{ color: "#64748b", fontSize: 14 }}>Pas encore de visites enregistrées.</p>
            )}
            {visites && visites.top_pages.map((p, i) => {
              const max = visites.top_pages[0]?.total || 1;
              return (
                <div key={p.path} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 4 }}>
                    <span style={{ color: "#1e293b", fontWeight: 600 }}>{i + 1}. {p.path === "/" ? "/ (Accueil)" : p.path}</span>
                    <span style={{ color: "#64748b", fontWeight: 700 }}>{p.total}</span>
                  </div>
                  <div style={{ background: "#f1f5f9", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${Math.round((p.total / max) * 100)}%`, height: "100%", background: brandBlue, borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

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