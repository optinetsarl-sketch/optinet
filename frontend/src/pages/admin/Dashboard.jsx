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

const Dashboard = () => {
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