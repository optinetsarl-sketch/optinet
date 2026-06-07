import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionTimeout = () => {
  const navigate = useNavigate();
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes en millisecondes

  useEffect(() => {
    let timer;
    let activityTimer;

    const handleActivity = () => {
      // Réinitialiser le timer à chaque activité
      clearTimeout(timer);
      clearTimeout(activityTimer);
      startTimer();
    };

    const startTimer = () => {
      // Timer principal pour logout après 30 minutes
      timer = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);

      // Listener pour détecter l'activité utilisateur
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
      
      events.forEach(event => {
        document.addEventListener(event, handleActivity);
      });
    };

    const logout = () => {
      // Nettoyer les tokens
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      
      // Afficher message et rediriger
      alert('Votre session a expiré. Veuillez vous reconnecter.');
      navigate('/login');
    };

    // Démarrer le timer si l'utilisateur est connecté
    const token = localStorage.getItem('access');
    if (token) {
      startTimer();
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(activityTimer);
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [navigate]);
};

export default useSessionTimeout;
