// src/admin/components/AdminLayout.jsx
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminStyles.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Empêcher la navigation vers les pages publiques depuis l'admin
  useEffect(() => {
    const handlePopState = (event) => {
      // Si on essaie de revenir à une page non-admin, rediriger vers l'admin
      if (!window.location.pathname.startsWith('/admin')) {
        event.preventDefault();
        navigate('/admin/jobs', { replace: true });
      }
    };

    // Écouter les changements d'historique (bouton retour)
    window.addEventListener('popstate', handlePopState);

    // S'assurer qu'on est bien dans l'admin au chargement
    if (!location.pathname.startsWith('/admin')) {
      navigate('/admin/jobs', { replace: true });
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await logout();
      navigate('/admin/login');
    }
  };

  const isActive = (path) => {
    // For routes, check if the current path starts with the route path
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  // Fonction pour naviguer en arrière dans l'admin
  const handleGoBack = () => {
    // Vérifier s'il y a une page précédente dans l'admin
    if (window.history.length > 1) {
      const previousPath = document.referrer;
      if (previousPath && previousPath.includes('/admin')) {
        navigate(-1);
      } else {
        navigate('/admin/jobs');
      }
    } else {
      navigate('/admin/jobs');
    }
  };

  return (
    <div className="admin-layout-container">
      <nav className="admin-navbar">
        <div className="navbar-left">
          <button onClick={handleGoBack} className="admin-back-button">
            ← Retour
          </button>
          <div className="navbar-logo">
            <Link to="/admin/jobs" className="logo-link">
              ENG<span>RND</span> Admin
            </Link>
          </div>
        </div>
        
        <div className="navbar-links">
          <Link to="/admin/jobs" className={isActive('/admin/jobs')}>
            Offres d'emploi
          </Link>
          <Link to="/admin/applications" className={isActive('/admin/applications')}>
            Candidatures
          </Link>
          <Link to="/admin/news" className={isActive('/admin/news')}>
            Actualités
          </Link>
          <Link to="/admin/messages" className={isActive('/admin/messages')}>
            Messages
          </Link>
          <Link to="/admin/home-content" className={isActive('/admin/home-content')}>
            Page d'accueil
          </Link>
        </div>

        <div className="navbar-user-section">
          <span className="user-welcome">
            Bonjour, {user?.username}
          </span>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </nav>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}