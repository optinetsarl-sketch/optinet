import {
  MessageSquare,
  Bell,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import "./Header.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";

const Header = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ name: "Chargement...", avatar: null });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setCurrentUser({
          name: res.data.username || "Utilisateur",
          avatar: null // On pourrait mettre l'avatar ici s'il existe dans le backend
        });
      } catch (err) {
        console.error("Erreur chargement user", err);
        setCurrentUser({ name: "Utilisateur", avatar: null });
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        {/* --- Gauche : Titre --- */}
        <h1 className="header__title">Dashboard Administrateur</h1>

        {/* --- Droite : Actions --- */}
        <div className="header__actions">
          {/* Messages */}
          <button className="header__icon-btn" title="Messages" aria-label="Messages">
            <MessageSquare size={20} />
            <span className="header__badge">3</span>
          </button>

          {/* Notifications */}
          <button className="header__icon-btn" title="Notifications" aria-label="Notifications">
            <Bell size={20} />
            <span className="header__badge header__badge--danger">5</span>
          </button>

          {/* Séparateur visuel */}
          <div className="header__divider" />

          {/* Utilisateur connecté + Profil */}
          <button 
            className="header__user-btn" 
            title="Mon profil"
            onClick={() => navigate("/admin/profile")}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="header__avatar"
              />
            ) : (
              <span className="header__avatar header__avatar--placeholder">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="header__username">{currentUser.name}</span>
            <ChevronDown size={16} className="header__chevron" />
          </button>

          {/* Déconnexion */}
          <button className="header__icon-btn header__icon-btn--logout" title="Déconnexion" aria-label="Déconnexion" onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            navigate("/");
          }}>
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;